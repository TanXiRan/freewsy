<template>
    <aside class="sidebar">
        <template v-for="(cat, idx) in categories" :key="cat?.name">
            <div class="side-option" @click="currentIndex = idx" :class="currentIndex === idx ? 'active' : ''">
                {{ cat?.name }}
            </div>
        </template>
    </aside>
    <div class="content-wrapper">
        <div class="chapters">
            <template v-for="chapter in categories[currentIndex]?.chapter_set" :key="chapter?.name">
                <chapter-item
                    :chapter="chapter"
                    @goChapter="handleGoChapter"
                    :isLearned="userStore.chapters && userStore.chapters.indexOf(chapter.id) !== -1" />
            </template>
        </div>
        <div class="start-learning" v-if="categories.length > 0">
            <a-button type="primary" @click="handleStartLearning">开始学习</a-button>
            <a-modal v-model:visible="showTip" simple :footer="false">
                <template #title>注意</template>
                <p>开始学习前，请您先注册并登录，以便确保您的学习数据同步！</p>
                <div style="display: flex; align-items: center; justify-content: center; margin-top: 10px">
                    <a-button @click="showTip = false" type="primary"> 好的 </a-button>
                </div>
            </a-modal>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ChapterItem from './ChapterItem.vue'
import { useRouter } from 'vue-router'
import { getCategory } from '@/request/api'
import { useUserStore } from '@/stores'
import { Category } from '@/types'
import { isAxiosError } from 'axios'
import { handleResError } from '@/plugin/ff'
import { errorNotify } from '@/plugin/notification'

const router = useRouter()
const currentIndex = ref(0)
const categories = ref<Array<Category>>([])
const showTip = ref(false)
const userStore = useUserStore()

const handleStartLearning = () => {
    if (userStore.username) {
        router.push({
            name: 'learning',
            params: {
                chapterId: userStore.nextChapterId,
            },
        })
        return
    }
    showTip.value = true
}

const handleGoChapter = (id: number) => {
    router.push({
        name: 'learning',
        params: {
            chapterId: id,
        },
    })
}
getCategory()
    .then((res) => (categories.value = res.data))
    .catch((err) => {
        if (isAxiosError(err)) {
            handleResError(err)
        } else {
            errorNotify('出错啦！请退出应用后重试')
        }
    })
// onMounted(async () => {
//     try {
//         const res = await getCategory()
//         categories.value = res.data
//     } catch (err) {
//         if (isAxiosError(err)) {
//             handleResError(err)
//         } else {
//             errorNotify('出错啦！请退出应用后重试')
//         }
//     }
// })
</script>

<style lang="scss" scoped>
.sidebar {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    max-width: 200px;
    width: 16%;
    background-color: var(--sidebarbg);
    height: calc(100vh - 84px);
    padding: 20px;
    margin-right: 14px;
}

.side-option {
    padding: 4px 0;
    font-size: 18px;
    text-align: center;
    transition: background-color 0.3s ease;
    position: relative;
    margin-bottom: 40px;
    font-weight: 500;
    &:last-child {
        margin-bottom: 0;
    }

    &:hover {
        background-color: var(--sidebaropthoverbg);
        border-radius: 5px;
    }
}
.active {
    color: #2d5df5;

    &::after {
        width: 30px;
        height: 3px;
        content: '';
        position: absolute;
        bottom: -12px;
        left: 50%;
        background-color: #2d5df5;
        transform: translateX(-50%);
    }
}

.router-link-exact-active {
    color: #2d5df5;

    &::after {
        width: 30px;
        height: 3px;
        content: '';
        position: absolute;
        bottom: -12px;
        left: 50%;
        background-color: #2d5df5;
        transform: translateX(-50%);
    }
}

.content-wrapper {
    width: 0;
    flex: 1;

    .start-learning {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
    }
}

.chapters {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
}
</style>
