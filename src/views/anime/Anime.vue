<template>
    <div class="container">
        <category-bar @on-click="handleOnClick" :animeCategories="animeCategories" />
        <div class="animes">
            <template v-for="anime in filterdAnimes" :key="anime.name">
                <anime-item :anime="anime"> </anime-item>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getAnime } from '@/request/api.js'
import { useAnimeStore } from '@/stores'
import AnimeItem from './AnimeItem.vue'
import CategoryBar from './CategoryBar.vue'
import { Anime } from '@/types'

const animeStore = useAnimeStore()
const animes = ref<Array<Anime>>([])
const cat = ref('全部')
const animeCategories = [
    {
        name: '全部',
    },
    {
        name: '科幻',
    },
    {
        name: '音乐',
    },
]

const filterdAnimes = computed(() => {
    if (cat.value === '全部') {
        return animes.value
    }

    return animes.value.filter((anime) => {
        return anime.categories.indexOf(cat.value) !== -1
    })
})

onMounted(async () => {
    const res = await getAnime()
    console.log(res)
    animes.value = res.data
    animeStore.setAnimes(res.data)
})

const handleOnClick = (val: string) => {
    cat.value = val
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    display: flex;
    height: 100%;
    overflow-x: hidden;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    padding-bottom: 60px;

    .animes {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        max-width: 1200px;
        height: 100%;
        margin: 0 auto;
    }
}
</style>
