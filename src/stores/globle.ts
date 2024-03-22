import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Names } from './namespace'

const useGlobleStore = defineStore(Names.global, () => {
    const netError = ref<boolean>(false)

    return {
        netError,
    }
})

export default useGlobleStore
