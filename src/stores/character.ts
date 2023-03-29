import { defineStore } from 'pinia'
import { ref } from 'vue'
import { SimpleCharacter } from '@/types'
import { Names } from './namespace'

const useCharacterStore = defineStore(Names.character, () => {
    const characters = ref<Array<SimpleCharacter>>([])

    const setCharacters = (data: Array<SimpleCharacter>) => {
        characters.value = data
    }

    return {
        characters,
        setCharacters,
    }
})

export default useCharacterStore
