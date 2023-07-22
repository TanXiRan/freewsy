<template>
    <header :class="{ fixed: isFixed }">
        <div class="site-icon">
            <div class="icon">
                <!-- <img src="/icon2.png" alt="" /> -->
                <h1 class="app-name"><span style="color: #2e51fe">free</span>wsy</h1>
            </div>
        </div>
        <ul class="tabs">
            <template v-for="tab in tabItems" :key="tab.name">
                <router-link :to="tab.path">
                    <li :key="tab.path" class="tab">
                        {{ tab.name }}
                    </li>
                </router-link>
            </template>
        </ul>
        <div class="profile">
            <profile />
        </div>
    </header>
</template>

<script setup lang="ts">
import profile from './profile.vue'
import { ref, onMounted, onBeforeUnmount, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const isFixed = ref(true)

const route = useRoute()
const tabItems = ref([
    {
        name: '首页',
        path: '/',
    },
    {
        name: '假名表',
        path: '/jiamingbiao',
    },
    {
        name: '五十音挑战',
        path: '/spell-game',
    },
    {
        name: '动漫推荐',
        path: '/animee',
    },
])

const setAppTitle = (name: string) => {
    window.electronAPI.setTitle(name)
}

const stop = watchEffect(() => {
    const path = route.path
    const tab = tabItems.value.find((tab) => tab.path === path)
    if (tab) {
        setAppTitle(tab!.name)
    } else {
        setAppTitle('章节学习')
    }
})

const handleScroll = function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    if (scrollTop > 2) {
        isFixed.value = true
    } else {
        isFixed.value = false
    }
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
    stop()
})
</script>

<style lang="scss" scoped>
header {
    height: 70px;
    overflow: hidden;
    background-color: var(--headerbg);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    &.fixed {
        box-shadow: -6px -11px 20px 8px rgba(0, 0, 0, 0.4);
    }

    .site-icon {
        display: flex;
        align-items: center;
        min-width: 120px;
        margin-left: 20px;
    }

    // .icon {
    //     height: 70px;

    //     overflow: hidden;
    //     img {
    //         height: 100%;
    //         object-fit: cover;
    //     }
    // }
    .app-name {
        font-weight: 900;
        letter-spacing: 1px;
        font-size: 32px;
    }

    .tabs {
        width: 0;
        flex: 1;
        display: flex;
        align-items: center;
        margin-left: 20px;
        font-size: 18px;
        font-weight: 400;
    }
    .tab {
        padding: 6px 24px;
        margin-right: 30px;
        transition: all 0.3s ease;
        &:last-child {
            margin-right: 0;
        }

        &:hover {
            background-color: var(--headertabhoverbg);
            border-radius: 4px;
            color: #2d5bf6;
        }
    }

    .router-link-active,
    .router-link-exact-active {
        .tab {
            position: relative;
            color: #2d5bf6;
            font-weight: 500;
            &::after {
                content: '';
                position: absolute;
                bottom: -7px;
                left: 50%;
                transform: translateX(-50%);
                width: 24px;
                height: 3px;
                background-color: #2d5bf6;
            }
        }
    }
    .profile {
        width: 220px;
        display: flex;
        align-items: center;
        width: 14vw;
        justify-content: flex-end;
        padding-right: 20px;
    }
}
</style>
