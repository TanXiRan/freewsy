import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Names } from './namespace'
import { Anime } from '@/types'

const useAnimeStore = defineStore(Names.anime, () => {
    const animes = ref<Array<Anime>>()

    const setAnimes = (data: Array<Anime>) => {
        animes.value = data
    }

    return {
        animes,
        setAnimes,
    }
})

export default useAnimeStore
