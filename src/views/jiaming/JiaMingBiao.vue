<template>
    <div class="container">
        <div class="left">
            <aside class="sidebar" v-if="category.length > 0">
                <template v-for="cat in category" :key="cat.name">
                    <div class="side-option" :class="cat.en_name === currentCategory ? 'active' : ''" @click="currentCategory = cat.en_name">
                        {{ cat.name }}
                    </div>
                </template>
            </aside>
            <div class="options">
                <div class="option" @click="showPing = !showPing" :class="showPing ? 'active-option' : ''">
                    <icon-check-circle-fill />
                    平假名
                </div>
                <div class="option" @click="showPian = !showPian" :class="showPian ? 'active-option' : ''">
                    <icon-check-circle-fill />
                    片假名
                </div>
                <div class="option" @click="showSpell = !showSpell" :class="showSpell ? 'active-option' : ''">
                    <icon-check-circle-fill />
                    罗马字符
                </div>
            </div>
            <p class="tip" v-if="showPian || showPing || showSpell">点击可听发音</p>
            <a-scrollbar style="height: 500px; overflow: auto" v-if="showPian || showPing || showSpell">
                <div class="character-cells" v-if="chapters.length > 0">
                    <template v-for="(chapter, idx) in curerntChapters" :key="chapter.name">
                        <chapter-item
                            :character_set="chapter.character_set"
                            :showPing="showPing"
                            :showPian="showPian"
                            :showSpelling="showSpell"
                            :idx="idx"
                            :category="chapter.category"
                            @handleClick="HandleClick" />
                    </template>
                </div>
            </a-scrollbar>
            <p class="tip" v-else>请选择平假名、片假名、罗马字中的至少一项</p>
        </div>
        <audio :src="audioUrl" :autoplay="false" ref="audioRef"></audio>
    </div>
</template>

<script setup lang="ts">
import ChapterItem from './ChapterItem.vue'
import { ref, onMounted, watch } from 'vue'
import { getChapter } from '@/request/api'
import formatUrl from '@/plugin/fn'
import { Chapter } from '@/types'

onMounted(async () => {
    try {
        const res = await getChapter()
        chapters.value = res.data
        console.log(chapters.value)
        currentCategory.value = 'qingyin'
    } catch (err) {
        console.log(err, typeof err)
    }
})
const category = ref([
    {
        name: '清音',
        en_name: 'qingyin',
    },
    {
        name: '浊音',
        en_name: 'zhuoyin',
    },
    {
        name: '拗音',
        en_name: 'aoyin',
    },
])

const chapters = ref<Array<Chapter>>([])
const showPing = ref(true),
    showPian = ref(true),
    showSpell = ref(true)

const currentCategory = ref('')
const curerntChapters = ref<Array<Chapter>>([])

watch(
    () => currentCategory.value,
    (newValue) => {
        console.log(newValue)
        curerntChapters.value = chapters.value.filter((chapter) => {
            return chapter.en_category === newValue
        })
        console.log(curerntChapters.value)
    }
)

const audioRef = ref<HTMLAudioElement>()
const audioUrl = ref('')

const playAudio = (url: string) => {
    audioUrl.value = formatUrl(url)
    setTimeout(() => {
        if (audioRef.value) audioRef.value.play()
    }, 50)
}

const HandleClick = (e: Event, url: string) => {
    console.log(url)
    if (!e.target) {
        return
    }
    const activeCell = document.querySelector('.active-cell')
    if (activeCell) {
        activeCell.classList.remove('active-cell')
    }
    const target = e.target as HTMLDivElement
    target.classList.add('active-cell')
    playAudio(url)
}
</script>

<style lang="scss" scoped>
.container {
    overflow: hidden;
    max-width: 1000px;
    margin: 0 auto;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;

    .left {
        width: 100%;
    }

    .sidebar {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
        width: 100%;
    }

    .side-option {
        max-width: 120px;
        flex: 1;
        padding: 4px 0;
        font-size: 18px;
        text-align: center;
        transition: background-color 0.3s ease;
        position: relative;
        font-weight: 400;
        margin-right: 20px;
        &:last-child {
            margin-right: 0;
        }

        &:hover {
            // background-color: #e8e6e6;
            background-color: var(--jiamingsideoption);
            border-radius: 5px;
        }
    }

    // @media (prefers-color-scheme: dark) {
    //     .side-option:hover {
    //         background-color: #4d4b4b !important;
    //     }
    //     .options .option {
    //         background-color: #232222;
    //     }
    // }
    .active {
        color: #2d5df5;

        &::after {
            width: 30px;
            height: 3px;
            content: '';
            position: absolute;
            bottom: -8px;
            left: 50%;
            background-color: #2d5df5;
            transform: translateX(-50%);
        }
    }
}

.options {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;

    .option {
        max-width: 120px;
        padding: 6px 20px;
        border-radius: 4px;
        // background-color: #e8e6e6;
        background-color: var(--jiamingoption);
        margin-right: 10px;
        text-align: center;
        font-size: 12px;
        &:hover {
            cursor: pointer;
        }
        &:last-child {
            margin-right: 0;
        }
    }

    .active-option {
        color: #fff;
        background-color: #4669f4 !important;
    }
}

.tip {
    text-align: center;
    margin: 0 10px;
    font-size: 12px;
}

.character-cells {
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    max-height: 560px;
}
</style>
