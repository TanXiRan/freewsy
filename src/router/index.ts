import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'
import Category from '../views/home/category/Category.vue'

import { useUserStore } from '@/stores'

const routes = [
    {
        path: '/',
        name: 'Home',
        redirect: '/category',
        // component: () => import('../views/home/HomeView.vue'),
        component: HomeView,
        children: [
            {
                path: 'category',
                name: 'category',
                component: Category,
                // component: () => import('../views/home/category/Category.vue'),
            },

            {
                path: 'learning/chapter:chapterId',
                name: 'learning',
                component: () => import('../views/home/learning/Learning.vue'),
            },
        ],
    },
    {
        path: '/spell-game',
        name: 'SpellGame',
        component: () => import('../views/game/SpellGame.vue'),
    },

    {
        path: '/jiamingbiao',
        name: 'JiaMingBiao',
        component: () => import('../views/jiaming/JiaMingBiao.vue'),
    },

    {
        path: '/animee',
        name: 'Animee',
        component: () => import('../views/anime/Anime.vue'),
    },

    {
        path: '/user/:uid',
        name: 'user',
        component: () => import('../views/profile.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from) => {
    if (to.name === 'learning') {
        setTimeout(() => {
            const userStore = useUserStore()
            if (!userStore.username) {
                return { name: 'category' }
            }
            const token = localStorage.getItem('wsy-token') || null
            const username = userStore.username
            const chapters = userStore.chapters
            const id = userStore.nextChapterId
            if (
                (token && username && chapters.includes(parseInt(to.params.chapterId as string))) ||
                (token && username && parseInt(to.params.chapterId as string) === id)
            ) {
                return true
            }
            return { name: 'category' }
        }, 300)
    }
})

export default router
