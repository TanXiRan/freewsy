<template>
    <div class="chapter-item" :class="isLearned ? 'leared-chapter' : 'unlocked-chapter'" @click="handleClick">
        <icon-check-circle class="leared" v-if="isLearned" />
        <icon-lock class="locked" v-else />
        <h2>{{ chapter?.name }}</h2>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores'
import { infoNotify } from '@/plugin/notification'
import { CatChapter } from '@/types'
const emits = defineEmits(['goChapter'])

const props = defineProps<{
    chapter: CatChapter
    isLearned: Boolean
}>()

const userStore = useUserStore()

const handleClick = () => {
    if (!userStore.username) {
        infoNotify('注意', '请先登录哦！')
        return
    }
    if (props.chapter.id == 1 || props.chapter.id == userStore.nextChapterId) {
        emits('goChapter', props.chapter.id)
        return
    }
    if (!props.isLearned) {
        infoNotify('注意', '完成上一章节才能解锁哦！')
        return
    }
    emits('goChapter', props.chapter.id)
}
</script>

<style lang="scss" scoped>
.chapter-item {
    width: 49%;
    border-radius: 4px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    padding: 24px 20px;
    display: flex;
    align-items: center;
    transition: background-color 0.3s ease-in-out;
    margin-right: 2%;
    margin-bottom: 20px;
    background-color: var(--chapterbg);

    cursor: pointer;
    &:hover {
        background-color: var(--chapterhoverbg);
    }

    &:nth-child(2n) {
        margin-right: 0;
    }

    h2 {
        font-weight: 400;
        font-size: 18px;
    }

    svg {
        width: 24px;
        height: 24px;
        color: rgb(61, 61, 244);
        margin-right: 14px;
        &.leared {
            color: #3a5cec;
        }
        &.locked {
            width: 20px;
            height: 20px;
        }
    }
}
</style>
