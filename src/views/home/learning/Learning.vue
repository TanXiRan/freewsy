<template>
    <aside class="sidebar">
        <template v-for="chapter in chapters" :key="chapter.name" v-if="chapters.length > 0">
            <div
                class="chapter"
                :class="{
                    'learned-chapter':
                        userStore.chapters.indexOf(chapter.id) !== -1,
                    'unlocked-chapter': !(
                        userStore.chapters.indexOf(chapter.id) !== -1
                    ),
                    'active-chapter': chapter.id == parseInt($route.params.chapterId as string),
                }"
                @click="
                    userStore.chapters.indexOf(chapter.id) !== -1
                        ? $router.push({
                              name: 'learning',
                              params: { chapterId: chapter.id },
                          })
                        : handleClick(chapter.id)
                ">
                <icon-check-circle class="learned" v-if="userStore.chapters.indexOf(chapter.id) !== -1" />
                <icon-lock class="locked" v-else />
                {{ chapter.name }}
            </div>
        </template>
        <div v-else></div>
    </aside>
    <div class="chapter-content" v-if="currentCharacter">
        <h2>{{ currentChapter.name }}</h2>
        <div class="characters">
            <div
                class="character"
                v-for="(cha, idx) in currentChapter.character_set"
                :key="cha.pian"
                :class="cha.pian === currentCharacter.pian ? 'character-active' : ''"
                @click="characterIndex = idx">
                {{ cha.ping }}
            </div>
        </div>
        <character-item :currentCharacter="currentCharacter" />

        <div class="actions">
            <a-button @click="handlePre" v-if="characterIndex > 0">学习上一个</a-button>
            <a-button @click="handleNext" v-if="characterIndex !== currentChapter.character_set.length - 1">学习下一个</a-button>
            <a-button
                @click="handleFinishChapter(currentChapter.id, userStore.user.learned_chapter.indexOf(currentChapter.id) !== -1 ? false : true)"
                type="primary"
                v-else
                >{{ isFinish ? '你已完成本章节' : '完成本章学习!' }}</a-button
            >
        </div>
        <a-modal v-model:visible="finishModal" simple :footer="false" :mask-closable="false" :esc-to-close="false">
            <template #title>
                <h4 class="modal-title">太棒啦！</h4>
            </template>
            <div class="finish-modal">
                <p class="content">你已完成本章节，继续加油哦！</p>
                <div class="btns">
                    <a-button @click="handleExit"> 退出学习 </a-button>
                    <a-button type="primary" @click="handleNextChapter" v-if="parseInt($route.params.chapterId as string) < 27"> 学习下一章 </a-button>
                    <a-button type="primary" @click="handleNextChapter" v-else> 重新学习第一章 </a-button>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CharacterItem from './CharacterItem.vue'
import { getChapter, getChapterWithFullChara, updateUser } from '@/request/api'
import { useUserStore } from '@/stores'
import { infoNotify } from '@/plugin/notification'
import { ChapterWithFullChara } from '@/types'

const router = useRouter()
const route = useRoute()

const isFinish = ref(false)
const finishModal = ref(false)

const chapters = ref<Array<ChapterWithFullChara>>([])
const currentChapter = ref<ChapterWithFullChara>({
    id: -1,
    name: '',
    category: '',
    en_category: '',
    path: '',
    character_set: [],
})
const userStore = useUserStore()

onMounted(async () => {
    // 还是用pinia存贮用户信息，在请求一次用户数据太慢了，感觉chapters数据都可以存pinia
    // chapters里的接口要优化一下，速度太慢了，不需要那么多东西
    // 感觉这个页面也不能用路由懒加载，慢
    // 路由改用watchEffect监听
    const res = await getChapter()
    chapters.value = res.data
})

const resetState = () => {
    isFinish.value = false
    characterIndex.value = 0
    finishModal.value = false
}

watch(
    () => route.path,
    async (newVal) => {
        if (route.params.chapterId) {
            const res = await getChapterWithFullChara(route.params.chapterId as string)
            currentChapter.value = res.data
            resetState()
        }
    },
    {
        deep: true,
        immediate: true,
    }
)

const characterIndex = ref(0)
const currentCharacter = computed(() => {
    if (currentChapter.value) {
        return currentChapter.value.character_set[characterIndex.value]
    }
})

const handleClick = (id: number) => {
    console.log(id)
    if (id == userStore.nextChapterId) {
        router.push({
            name: 'learning',
            params: { chapterId: id },
        })
        return
    }
    infoNotify('注意', '完成上一章节才能解锁哦！')
}

const handlePre = () => {
    if (characterIndex.value > 0) {
        characterIndex.value--
    } else {
        return
    }
}

const handleNext = () => {
    if (characterIndex.value < currentChapter.value.character_set.length - 1) {
        characterIndex.value++
    } else {
        return
    }
}

const handleFinishChapter = async (id: number, state: boolean) => {
    finishModal.value = true
    isFinish.value = true

    // 发请求更新数据
    if (!state) {
        return
    }
    console.log(id)

    const res = await updateUser(userStore.user.id!, {
        learned_chapter: [id],
    })
    console.log(res.data)
    userStore.setUser(res.data)
}

const handleNextChapter = () => {
    resetState()
    const nextId = parseInt(route.params.chapterId as string) < 27 ? parseInt(route.params.chapterId as string) + 1 : 1
    router.push({
        name: route.name as string,
        params: { chapterId: nextId },
    })
}

const handleExit = () => {
    finishModal.value = false
    router.push({
        name: 'category',
    })
}
</script>
<style lang="scss" scoped>
.sidebar {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    max-width: 260px;
    width: 16%;
    background-color: var(--sidebarbg);
    height: calc(100vh - 84px);
    padding: 20px 14px;
    margin-right: 14px;
    overflow-y: scroll;
    overflow-x: hidden;
}

.chapter {
    padding: 6px 4px;
    font-size: 15px;
    transition: background-color 0.3s ease;
    position: relative;
    // margin-bottom: 24px;
    margin-bottom: 18px;
    font-weight: 400;
    text-align: left;
    &:hover {
        background-color: var(--sidebaropthoverbg);
        border-radius: 5px;
        cursor: pointer;
    }

    // text-overflow: ellipsis;
    // white-space: nowrap;
    // overflow: hidden;
    &:last-child {
        margin-bottom: 0;
    }

    svg {
        color: #2d5df5;
        margin-right: 4px;
    }
}

.learned-chapter {
    &:hover {
        background-color: var(--sidebaropthoverbg);
        border-radius: 5px;
        cursor: pointer;
    }
    &.active {
        color: #2d5df5;

        &::after {
            width: 60px;
            height: 3px;
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            background-color: #2d5df5;
            transform: translateX(-50%);
        }
    }
    &.active-chapter {
        color: #2d5df5;
        border-radius: 5px;
        background-color: var(--sidebaropthoverbg);

        &::after {
            width: 60px;
            height: 3px;
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            background-color: #2d5df5;
            transform: translateX(-50%);
        }
    }
}
// .unlocked-chapter {
//     background-color: #f9f9f9;
//     border-radius: 5px;
//     // pointer-events: none;
// }

.chapter-content {
    width: 0;
    flex: 1;
    // padding: 28px 60px;
    padding: 28px 30px;
    height: calc(100vh - 84px);
    background-color: var(--chapterbg);
    overflow: hidden;
}

h2 {
    font-weight: 500;
    padding-bottom: 22px;
    border-bottom: 1px solid var(--sidebaropthoverbg);
    text-align: center;
}

.characters {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px 0;
    border-bottom: 1px solid var(--sidebaropthoverbg);
}
.character {
    flex: 1;
    margin: 0 20px;
    padding: 7px 0;
    font-size: 20px;
    font-weight: 700;
    text-align: center;
    transition: background-color 0.3s ease;
}
.character:hover {
    cursor: pointer;
    background-color: #f2f3f5;
    border-radius: 5px;
}
.character-active {
    position: relative;
    color: #385cec;
}
.character-active:hover {
    background-color: transparent;
}
.character-active::after {
    width: 14px;
    height: 3px;
    position: absolute;
    content: '';
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #385cec;
}

.actions {
    width: 100%;
    border-top: 1px solid var(--sidebaropthoverbg);
    display: flex;
    justify-content: center;
    padding-top: 20px;
}

.arco-btn {
    margin-right: 20px;
}
.arco-btn:last-child {
    margin-right: 0;
}

.finish-modal {
    text-align: center;
    font-size: 16px;
    .btns {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        button {
            margin-right: 20px;
            padding: 2px 22px;
        }
    }
}
</style>
