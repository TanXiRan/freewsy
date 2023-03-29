<template>
    <div class="changeTheme" @click="toggleTheme">
        <icon-sun-fill v-if="isLight" />
        <icon-moon-fill v-else />
    </div>
    <a-popover position="br">
        <a-avatar
            v-if="!userStore.user.avatar"
            :style="{
                backgroundColor: '#3650F4',
                cursor: 'pointer',
                fontSize: '14px',
            }"
            >登录</a-avatar
        >
        <img :src="formatUrl(userStore.user.avatar_path)" alt="" v-else :style="{ width: '40px', height: '40px', borderRadius: '50%' }" />
        <template #content>
            <template v-if="!userStore.user.username">
                <p @click="showLogin = true" class="profile-option"><icon-user class="pro-opr-icon" />立即登录</p>
                <p @click="showRegister = true" class="profile-option"><icon-user-add class="pro-opr-icon" />立即注册</p>
            </template>
            <template v-else>
                <router-link :to="{ name: 'user', params: { uid: userStore.user.id } }">
                    <p @click="userInfo = true" class="profile-option"><icon-user class="pro-opr-icon" />个人信息</p>
                </router-link>
                <p @click="confirmLogout = true" class="profile-option"><icon-import class="pro-opr-icon" />退出登录</p>
            </template>
        </template>
    </a-popover>

    <a-modal v-model:visible="showLogin" simple :footer="false">
        <template #title> 登录五十音 </template>
        <login @afterSubmit="showLogin = false" />
    </a-modal>
    <a-modal v-model:visible="showRegister" simple :footer="false">
        <template #title> 注册五十音账号 </template>
        <register @afterRegister="showRegister = false" />
    </a-modal>
    <a-modal v-model:visible="confirmLogout" simple @ok="handleLogout" @cancel="confirmLogout = false">
        <template #title> 退出登录 </template>
        <div>确认退出，将清除登录数据及网站缓存</div>
    </a-modal>
</template>

<script setup lang="ts">
import login from './login.vue'
import register from './register.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import formatUrl from '@/plugin/fn'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const showLogin = ref(false)
const showRegister = ref(false)
const confirmLogout = ref(false)

const userInfo = ref(false)

const isLight = ref(true)
// const toggleTheme = () => {
//     if (isLight.value) {
//         document.body.setAttribute('arco-theme', 'dark')
//         document.body.setAttribute('color-theme', 'dark')
//     } else {
//         document.body.removeAttribute('arco-theme')
//         document.body.removeAttribute('color-theme')
//     }
//     isLight.value = !isLight.value
// }

const toggleTheme = () => {
    const theme = document.body.getAttribute('color-theme')
    if (theme) {
        document.body.removeAttribute('arco-theme')
        document.body.removeAttribute('color-theme')
        isLight.value = true
    } else {
        document.body.setAttribute('arco-theme', 'dark')
        document.body.setAttribute('color-theme', 'dark')
        isLight.value = false
    }
}

const handleLogout = () => {
    localStorage.removeItem('wsy-token')
    userStore.clearUser()
    router.push({ name: 'category' })
}
</script>

<style lang="scss" scoped>
.changeTheme {
    display: flex;
    align-items: center;
    cursor: pointer;

    svg {
        width: 20px;
        height: 20px;
        margin-right: 24px;
        transition: all 0.3s ease;
    }
}

.arco-avatar,
.arco-avatar-circle {
    svg {
        width: 19px;
        height: 19px;
    }
}

.profile-option {
    font-size: 16px;
    letter-spacing: 1px;
    cursor: pointer;
    margin-bottom: 5px;
    padding: 2px 6px;
    transition: all 0.3s ease;
    &:hover {
        background-color: #f2f2f2;
        border-radius: 4px;
    }
    .pro-opr-icon {
        margin-right: 8px;
        color: #2d5bf6;
    }
    svg {
        margin-right: 8px;
        color: #2d5bf6;
    }
}
</style>
