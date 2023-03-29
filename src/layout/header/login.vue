<template>
    <a-form :model="form" @submit="handleSubmit">
        <a-form-item field="username" label="用户名">
            <a-input placeholder="请输入用户名" allow-clear v-model.trim="form.username" ref="usernameRef">
                <template #prefix>
                    <icon-user />
                </template>
            </a-input>
        </a-form-item>
        <a-form-item field="password" label="密码">
            <a-input-password placeholder="请输入密码" allow-clear v-model.trim="form.password">
                <template #prefix>
                    <icon-common />
                </template>
            </a-input-password>
        </a-form-item>
        <a-form-item>
            <a-button html-type="submit">登录</a-button>
        </a-form-item>
    </a-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { getToken, getUser, refreshToken } from '@/request/api'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { successNotify, errorNotify } from '@/plugin/notification'
import { handleResError } from '@/plugin/ff'
import { isAxiosError } from 'axios'

const form = reactive({
    username: '',
    password: '',
})
const router = useRouter()
const userStore = useUserStore()

// const handleInput = (val: string, evt: Event) => {
//     console.log(val)
// }
const usernameRef = ref<HTMLInputElement>()
const emits = defineEmits(['afterSubmit'])

const handleSubmit = async () => {
    if (form.username === '' || form.password === '') {
        usernameRef.value?.focus()
        errorNotify('请先输入账号和密码')
        return
    }
    console.log(form)
    try {
        // 获取token
        const res = await getToken({
            username: form.username,
            password: form.password,
        })
        if (res.data.verified) {
            // 获取用户信息
            const user = await getUser(parseInt(res.data.user_id))
            userStore.setUser(user.data)
            // 获取刷新后长时间存储的token
            const refreshedhToken = await refreshToken({
                refresh: res.data.refresh,
            })
            localStorage.setItem('wsy-token', refreshedhToken.data.access)
            successNotify('登录成功！')
            form.username = ''
            form.password = ''
            emits('afterSubmit')
            router.push({
                name: 'category',
            })
        } else {
            errorNotify(res.data.msg)
        }
    } catch (err) {
        if (isAxiosError(err)) {
            handleResError(err)
        } else {
            console.log(err)
            errorNotify('出错啦！请退出应用后重试')
        }
    }
}
</script>
