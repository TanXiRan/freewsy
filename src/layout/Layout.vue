<template>
    <div class="layout">
        <Header />
        <div class="xxxx" v-if="netError">xsaadsdasdadass</div>
        <main v-else>
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
import { ref } from 'vue'
import { useGlobleStore } from '@/stores'
import { watchEffect } from 'vue'

const netError = ref<boolean>(false)
watchEffect(() => {
    if (store.netError) {
        netError.value = true
    }
})

const store = useGlobleStore()
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
