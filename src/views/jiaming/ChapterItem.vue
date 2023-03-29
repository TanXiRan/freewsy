<template>
    <div class="chapter">
        <template v-for="character in character_set" :key="character.pian">
            <div class="cell" @click.capture="onClick($event, character.spelling_path)">
                <p v-if="showPing" :class="showPing ? 'active-p' : ''">
                    {{ character.ping }}
                </p>
                <div class="sub" :class="showPian && !showPing ? 'active-sub' : ''">
                    <p v-if="showPian" :class="showPian && !showPing ? 'active-p' : ''">
                        {{ character.pian }}
                    </p>
                    <p v-if="showSpelling" :class="showSpelling && !showPian && !showPing ? 'active-p' : ''">
                        {{ character.spelling }}
                    </p>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { SimpleCharacter } from '@/types'

defineProps({
    character_set: Array<SimpleCharacter>,
    showPing: Boolean,
    showPian: Boolean,
    showSpelling: Boolean,
    idx: Number,
    category: String,
})

const emits = defineEmits(['handleClick'])

const onClick = (evt: Event, url: string) => {
    console.log(evt, url)
    emits('handleClick', evt, url)
}
</script>

<style lang="scss" scoped>
.chapter {
    display: flex;
    width: 100%;
    height: auto;
    justify-content: center;
}

.cell {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    max-width: 100px;
    height: 100px;
    font-weight: 400;
    // border: 2px solid rgb(83, 82, 82);
    border: 2px solid var(--jiamingcellborder);
    text-align: center;
    margin-bottom: 8px;
    margin-right: 8px;
    border-radius: 1px;
    // background-color: #f8f8f8;
    background-color: var(--jiamingcellbg);
    &:hover {
        cursor: pointer;
    }
    div,
    p {
        pointer-events: none;
    }
}
// @media (prefers-color-scheme: dark) {
//     .cell {
//         background-color: var(--chapterbg);
//         border: 2px solid transparent;
//     }
// }
.active-cell {
    border-color: #2d5df5;
    color: #2d5df5;
}

.active-p {
    font-size: 24px;
}

.sub {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1.5;
    font-size: 16px;

    p {
        margin-right: 8px;
        &:last-child {
            margin-right: 0;
        }
    }
}

.active-sub {
    flex-direction: column;
    justify-content: center;
    p {
        margin-right: 0;
    }
}
</style>
