<template>
    <div class="layout">
        <Header />
        <main>
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <KeepAlive :include="['Home', 'JiaMingBiao', 'Anime']" :max="5">
                        <component :is="Component" />
                    </KeepAlive>
                </transition>
            </router-view>
        </main>
    </div>
</template>

<script setup lang="ts">
import Header from './header/Header.vue'
</script>

<style scoped>
main {
    width: 100%;
    margin-top: 70px;
    min-height: calc(100vh - 70px);
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
