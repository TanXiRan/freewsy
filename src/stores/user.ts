import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Names } from './namespace'
import { User } from '@/types'

const useUserStore = defineStore(Names.user, () => {
    const user = ref<User>({
        learned_chapter: [],
        anime: [],
    })

    const username = computed(() => {
        return user.value.username
    })

    const chapters = computed(() => {
        return user.value.learned_chapter
    })

    const animes = computed(() => {
        return user.value.anime
    })

    const chapters_length = computed(() => {
        return chapters.value.length
    })

    const nextChapterId = computed(() => {
        return chapters_length.value > 1 && chapters_length.value < 27
            ? chapters.value[chapters_length.value - 1] + 1
            : 1
    })

    const setUser = (data: User) => {
        user.value = data
    }

    const clearUser = () => {
        user.value = {
            learned_chapter: [],
            anime: [],
        }
    }

    return {
        user,
        setUser,
        username,
        chapters,
        animes,
        chapters_length,
        nextChapterId,
        clearUser,
    }
})

export default useUserStore
