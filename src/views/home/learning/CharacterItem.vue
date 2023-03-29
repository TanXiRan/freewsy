<template>
    <div class="character-item">
        <audio :src="audioUrl" :autoplay="false" ref="audioRef"></audio>
        <div class="images card" v-if="currentCharacter.pian_path">
            <h3><span class="indicator"></span>五十音笔顺图</h3>
            <div class="ping">
                <img :src="formatUrl(currentCharacter.ping_path)" alt="" />
                <h4>平假名</h4>
            </div>
            <div class="pian">
                <img :src="formatUrl(currentCharacter.pian_path)" alt="" />
                <h4>片假名</h4>
            </div>
        </div>
        <div class="pronounciation card">
            <h3><span class="indicator"></span>发音技巧</h3>
            <div v-if="currentCharacter.pro_skill">
                <p>
                    {{ currentCharacter.pro_skill }}
                </p>
                <img :src="formatUrl(currentCharacter.pro_skill_image_path)" alt="" />
            </div>

            <div class="play">
                <icon-sound-fill />
                <span class="spell">[ {{ currentCharacter.spelling }} ]</span>

                <a-button @click="playAudio(currentCharacter.spelling_path)">播放发音</a-button>
            </div>
        </div>
        <div class="astmemories card" v-if="currentCharacter.memory">
            <h3><span class="indicator"></span>联想记忆</h3>
            <p>{{ currentCharacter.memory }}</p>
            <img :src="formatUrl(currentCharacter.memory_path)" />
        </div>
        <div class="scenes card">
            <h3><span class="indicator"></span>名场面</h3>
            <img :src="formatUrl(currentCharacter.scene_gif_path)" alt="" class="scene-img" />
            <div class="text">
                <p>{{ currentCharacter.scene_text }}</p>
                <p>{{ currentCharacter.scene_cn_text }}</p>
                <div class="text-from">
                    <span>{{ currentCharacter.scene_text_from }}</span>
                </div>
            </div>
            <div class="btn">
                <a-button @click="playAudio(currentCharacter.scene_spelling_path)"> <icon-sound-fill />播放发音</a-button>
            </div>
        </div>
        <div class="words card" v-if="currentCharacter.word_set.length > 0">
            <h3><span class="indicator"></span>单词学习</h3>
            <template v-for="word in currentCharacter.word_set" :key="word.name">
                <div class="word">
                    <h3>{{ word.name }}</h3>
                    <span>{{ word.explanation }}</span>
                    <a-button @click="playAudio(word.pronounce_url)"> <icon-sound-fill class="sound-icon" />播放发音</a-button>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import formatUrl from '@/plugin/fn'
import { FullCharacter } from '@/types'

defineProps<{
    currentCharacter: FullCharacter
}>()

const audioRef = ref<HTMLAudioElement>()
const audioUrl = ref('')

const playAudio = (url: string) => {
    audioUrl.value = formatUrl(url)
    setTimeout(() => {
        if (audioRef.value) audioRef.value.play()
    }, 50)
}
</script>

<style lang="scss" scoped>
.character-item {
    padding: 20px 0;
    display: flex;
    justify-content: center;
    .images {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        img {
            max-width: 150px;
        }
    }
    .card {
        flex: 1;
        max-width: 196px;
        padding: 14px;
        border-radius: 4px;
        box-shadow: 0 0 14px 1px rgba(0, 0, 0, 0.08);
        margin-right: 20px;
        min-height: 426px;
        line-height: 1.25;
        font-size: 15px;
        &:last-child {
            margin-right: 0;
        }
        button {
            color: #fff;
            background-color: var(--btnbg);
        }
    }

    h3 {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        font-weight: 500;
        font-size: 17px;
    }
    .indicator {
        display: inline-block;
        width: 2px;
        height: 15px;
        background-color: #385cec;
        margin-right: 8px;
    }

    .ping,
    .pian {
        width: 100%;
        padding: 4px 4px 8px;
        text-align: center;
        background-color: #f2f3f5;
        border-radius: 4px;
    }
    .ping {
        margin-bottom: 14px;
    }

    .pronounciation svg {
        font-size: 44px;
        color: #385cec;
        margin-bottom: 5px;
    }
    .play {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 14px;
    }
    .spell {
        font-size: 16px;
        margin-bottom: 14px;
    }

    .astmemories img {
        margin-top: 14px;
        border-radius: 4px;
        transform: scale(1.1);
    }

    .scenes {
        line-height: 1.2;
        .scene-img {
            border-radius: 4px;
            margin-bottom: 14px;
        }

        .text p {
            margin-bottom: 5px;
        }

        .text-from {
            margin-top: 10px;
            text-align: right;
            font-size: 12px;
        }

        .btn {
            display: flex;
            justify-content: center;
            margin-top: 14px;
            svg {
                margin-right: 4px;
            }
        }
    }

    .word {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: var(--wordbg);
        border-radius: 4px;
        line-height: 1.2;
        margin-bottom: 10px;
        padding: 16px 0;

        h3 {
            font-weight: 400;
        }

        span {
            font-size: 14px;
        }
        button {
            margin-top: 8px;
            background-color: #2e51fe;
            color: #fff;
            border-radius: 4px;
            font-size: 12px;
        }
        .sound-icon {
            margin-right: 5px;
        }
    }
}
</style>
