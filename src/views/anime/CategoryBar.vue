<template>
    <div class="category-bar">
        <template v-for="(cat, idx) in animeCategories" :key="cat.name">
            <span class="cat" @click="handleClick(idx)" :class="idx === catIdx ? 'active ' : ''">
                {{ cat.name }}
            </span>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const catIdx = ref(0)

const props = defineProps<{
    animeCategories: Array<{
        name: string
    }>
}>()

const emits = defineEmits(['onClick'])

const handleClick = (idx: number) => {
    catIdx.value = idx
    emits('onClick', props.animeCategories[idx].name)
}
</script>

<style lang="scss" scoped>
.category-bar {
    display: flex;
    align-items: center;
    padding: 3px;
    margin: 0 20px 20px;
    border-radius: 8px;
    background-color: #e1e0e0;
    color: gray;
    width: 1200px;

    .cat {
        display: flex;
        align-items: center;
        padding: 5px 20px;
        margin-right: 10px;
        border-radius: 4px;
        &:hover {
            cursor: pointer;
        }
        &.active {
            color: #fff;
            background-color: #395cee;
            border-radius: 5px;
        }
    }
}
</style>
