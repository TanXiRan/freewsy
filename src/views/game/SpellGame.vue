<template>
    <div class="container">
        <header>
            <h1>平假名测试</h1>
        </header>
        <div class="game">
            <div class="data">
                <p class="time">用时：{{ time }}</p>
                <p class="current-score">得分：{{ score }}</p>
                <p class="max-score">最高得分：{{ max_score }}</p>
                <p class="min-time">最短用时：{{ min_time < 10000000 ? min_time : '暂无记录' }}</p>
            </div>
            <div class="current-character">
                <p>{{ current.ping }}</p>
            </div>
            <div class="input-box">
                <input type="text" ref="inputRef" @keyup.enter="handleChange" v-model.trim="input" class="input" />
                <div v-if="isPlaying">
                    <button class="next-btn" @click="handleNext(false)" v-show="error">下一个</button>
                    <button class="next-btn" @click="handleNext(true)" v-show="!error">跳过</button>
                    <p class="erorr-msg" v-if="error">{{ errorMsg }}</p>
                </div>
            </div>
        </div>
        <!-- <a-button @click="finishGame">end</a-button>
        <a-button @click="score++">plus</a-button> -->
        <div class="actions">
            <button @click="startGame" v-if="!isPlaying" class="start-game">开始测试</button>
            <button @click="endGame" v-if="isPlaying && !isFinish" class="end-game">结束</button>
            <button @click="finishGame" v-if="isPlaying && isFinish" class="finish-game">完成</button>
            <button @click="pauseGame" v-if="!isPause && isPlaying && !isFinish" class="pause-game">暂停</button>
            <button @click="continueGame" v-if="isPause && isPlaying && !isFinish" class="continue-game">继续</button>
        </div>
        <a-modal v-model:visible="showFinshModal" simple :footer="false" :mask-closable="false" :esc-to-close="false">
            <template #title>
                <h4>{{ isFinish ? '完成测试' : '确认结束' }}</h4>
            </template>
            <div class="finish-modal">
                <template v-if="isFinish">
                    <p>太棒啦，恭喜你完成测试！</p>
                    <p>
                        用时：{{ time }}秒
                        <span v-if="time < min_time" class="new-record"> 新纪录！</span>
                    </p>
                    <p>
                        得分：{{ score }}分
                        <span v-if="score === max_score && score > 0" class="new-record"> 新纪录！ </span>
                    </p>
                    <p>答对：{{ rightNum }}</p>
                    <p>答错：{{ errored }}</p>
                    <p>跳过：{{ skiped }}</p>
                    <div class="btns">
                        <a-button @click="backHome" type="primary"> 返回首页 </a-button>
                        <a-button @click="replay"> 再来一次 </a-button>
                    </div>
                </template>
                <template v-else>
                    <p>你还没有完成测试，确定要退出吗？</p>
                    <div class="btns">
                        <a-button @click="replay" type="primary"> 确认 </a-button>
                        <a-button @click="cancelExit"> 取消 </a-button>
                    </div>
                </template>
            </div>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getSimpleCharacter, updateUser } from '@/request/api'
import { useCharacterStore, useUserStore } from '@/stores'
import { SimpleCharacter } from '@/types'

const router = useRouter()
const userStore = useUserStore()
const characterStore = useCharacterStore()
const hiraganas = ref<Array<SimpleCharacter>>([])

const current = ref<SimpleCharacter>({
    ping: '',
    pian: '',
    spelling: '',
    spelling_path: '',
})

const input = ref('')
const inputRef = ref<HTMLInputElement>()

const score = ref(0)
const maxScore = ref(0)
const rightNum = ref(0)
const skiped = ref(0)
const errored = ref(0)

const max_score = computed(() => {
    return Math.max(score.value, maxScore.value)
})

const time = ref(0)
const min_time = ref(0)

const error = ref(false)
const errorMsg = ref('')

const isPlaying = ref(false)
const isPause = ref(false)
const isFinish = ref(false)
const showFinshModal = ref(false)

onMounted(async () => {
    // 先请求数据
    const res = await getSimpleCharacter()
    console.log(res.data)
    hiraganas.value = res.data
    characterStore.setCharacters(res.data)

    // 生成随机索引
    setCurrent()
    disableInput()

    // 从userStore获取历史数据
    setRecords()

    // 监听键盘快捷键
    document.onkeydown = function (event) {
        const keyCode = event.keyCode
        if (keyCode === 84 && event.shiftKey) {
            event.preventDefault() //关闭浏览器默认快捷键
            startGame()
        } else if (keyCode === 83 && event.shiftKey && !error.value) {
            event.preventDefault()
            handleNext(true)
        } else if (keyCode === 69 && event.shiftKey) {
            event.preventDefault()
            endGame()
        } else if (keyCode === 80 && event.shiftKey) {
            event.preventDefault()
            pauseGame()
        } else if (keyCode === 67 && event.shiftKey) {
            event.preventDefault()
            continueGame()
        } else if (keyCode === 78 && error.value && event.shiftKey) {
            event.preventDefault()
            handleNext(false)
        }
    }
})

const setRecords = () => {
    maxScore.value = userStore.user.max_score || 0
    min_time.value = userStore.user.min_time || 10000000
}

const disableInput = () => {
    inputRef.value!.setAttribute('disabled', 'true')
    input.value = ''
}

const enableInput = () => {
    inputRef.value!.removeAttribute('disabled')
    inputRef.value!.focus()
    input.value = ''
    error.value = false
    errorMsg.value = ''
}

const handleNext = (skip: boolean) => {
    if (!isPlaying.value) {
        return
    }
    if (hiraganas.value.length === 0) {
        isFinish.value = true
        return
    }
    if (skip) ++skiped.value
    setCurrent()
    enableInput()
}

const setCurrent = () => {
    const randomIndex = Math.floor(Math.random() * hiraganas.value.length)
    current.value = hiraganas.value.splice(randomIndex, 1)[0]
}

const handleChange = () => {
    const target = current.value.spelling

    if (input.value !== target) {
        error.value = true
        errorMsg.value = `错了哦！${current.value.ping}的正确读音是[ ${target} ]`
        input.value = target
        inputRef.value!.setAttribute('disabled', 'true')
        score.value = 0
        ++errored.value
    } else {
        ++score.value
        ++rightNum.value
        handleNext(false)
    }
}
const timer = (() => {
    let intervalId: string | number | NodeJS.Timer | null | undefined = null

    function count() {
        time.value++
    }

    function start() {
        if (intervalId === null) {
            count()
            intervalId = setInterval(count, 1000)
        }
    }

    function stop() {
        clearInterval(intervalId as number)
        intervalId = null
    }

    function reset() {
        stop()
        time.value = 0
    }
    return { startCount: start, stopCount: stop, restTimer: reset }
})()

// 开始测试
const startGame = () => {
    enableInput()
    isPlaying.value = true
    timer.startCount()
}

// 暂停测试
const pauseGame = () => {
    timer.stopCount()
    isPause.value = true
}

// 继续测试
const continueGame = () => {
    timer.startCount()
    isPause.value = false
}

// 结束测试
const endGame = async () => {
    timer.stopCount()
    showFinshModal.value = true
}

// 完成测试
const finishGame = async () => {
    timer.stopCount()
    const data = {
        max_score: max_score.value,
        min_time: Math.min(time.value, min_time.value),
    }
    console.log(data)
    const res = await updateUser(userStore.user.id!, data)
    console.log(res)
    userStore.setUser(res.data)
    isFinish.value = true
    showFinshModal.value = true
}

// 回到首页
const backHome = () => {
    showFinshModal.value = false
    router.push({ name: 'category' })
}

// 重玩游戏
const replay = () => {
    showFinshModal.value = false
    hiraganas.value = characterStore.characters
    resetState()
    setCurrent()
    disableInput()
    timer.restTimer()
    setRecords()
}

// 重置游戏状态
const resetState = () => {
    score.value = 0
    isPlaying.value = false
    isPause.value = false
    isFinish.value = false
}

// 取消退出
const cancelExit = () => {
    showFinshModal.value = false
    timer.startCount()
}
</script>

<style lang="scss" scoped>
.container {
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

header {
    width: 100%;
    display: flex;
    align-items: center;
    text-align: center;
    padding: 10px 0;

    h1 {
        width: 100%;
        font-size: 40px;
    }
}

.game {
    width: 100%;
    max-width: 1000px;
    padding: 0 20px;
    text-align: center;
    margin-bottom: 0 auto 40px;
    flex: 1;
}
.data {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;

    p {
        margin-right: 14px;
        &:last-child {
            margin-right: 0;
        }
    }
}

.current-character {
    height: 200px;
    line-height: 200px;
    font-size: 120px;
    font-weight: 500;
    margin-bottom: 20px;
}

.input-box {
    height: 160px;
    overflow: hidden;
}

.input {
    padding: 8px 8px;
    max-width: 100px;
    border: 1px solid transparent;
    // border-bottom: 2px solid rgb(23, 22, 22);
    border-bottom: 2px solid var(--gameinputborder);
    outline: none;
    appearance: none;
    background-color: transparent;
    font-size: 36px;
    color: rgb(23, 22, 22);
    text-align: center;
    caret-color: var(--gameinputcaret);
}
// @media (prefers-color-scheme: dark) {
//     .input {
//         border-bottom: 2px solid #f1f1f1;
//         caret-color: #f1f1f1;
//     }
//     .next-btn {
//         background-color: #444040 !important;
//     }
// }

.erorr-msg {
    margin-top: 20px;
    font-size: 18px;
}

.next-btn {
    padding: 6px 20px;
    border-radius: 4px;
    margin-top: 20px;
    // background-color: rgb(23, 23, 23);
    background-color: var(--gamenextbtn);
    outline: none;
    appearance: none;
    border: none;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
}

.actions {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-top: 10px;

    button {
        width: 100px;
        margin-right: 20px;
        padding: 6px 18px;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
        background-color: #f1f1f1;
        border: 1px solid transparent;
        border-radius: 2px;
        color: #fff;

        &:hover {
            cursor: pointer;
        }
        &:last-child {
            margin-right: 0;
        }
    }

    .start-game {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #2d5cf6;
    }

    .end-game {
        background-color: rgb(255, 42, 0);
    }

    .finish-game {
        background-color: #2d5df5;
    }
    .pause-game {
        background-color: rgb(255, 86, 8);
    }
    .continue-game {
        background-color: #2d5cf6;
    }
}

.arco-modal-header {
    margin-bottom: 14px;
}
.finish-modal {
    padding: 0 20px;
    font-size: 16px;
    p {
        margin-bottom: 5px;
    }
    .new-record {
        color: red;
        font-style: italic;
    }

    .btns {
        display: flex;
        justify-content: center;
        margin-top: 18px;
        button {
            margin-right: 20px;
            padding: 2px 22px;
        }
    }
}
</style>
