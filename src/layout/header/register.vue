<template>
    <a-form :model="form" @submit="handleSubmit">
        <a-form-item field="username" label="用户名">
            <a-input placeholder="请输入用户名" allow-clear v-model.trim="form.username" ref="usernameRef">
                <template #prefix>
                    <icon-user />
                </template>
            </a-input>
        </a-form-item>
        <a-form-item field="email" label="邮箱">
            <a-input placeholder="请输入邮箱" allow-clear v-model.trim="form.email">
                <template #prefix>
                    <icon-email />
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

        <a-form-item field="isRead">
            <a-checkbox v-model="keepAlive"> 注册后直接登录 </a-checkbox>
        </a-form-item>
        <a-form-item>
            <a-button html-type="submit">注册</a-button>
        </a-form-item>
    </a-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { register, getToken, getUser, refreshToken } from '@/request/api'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { successNotify, errorNotify } from '@/plugin/notification'
import { isAxiosError } from 'axios'
import { handleResError } from '@/plugin/ff'

const userStore = useUserStore()
const router = useRouter()
const form = reactive({
    username: '',
    password: '',
    email: '',
})

const keepAlive = ref(false)

const usernameRef = ref<HTMLInputElement>()
const emits = defineEmits(['afterRegister'])
const handleSubmit = async () => {
    if (form.username === '' || form.password === '' || form.email === '') {
        usernameRef.value?.focus()
        errorNotify('请先输入注册信息！')
        return
    }
    try {
        const res = await register(form)
        if (res.data.verified) {
            if (keepAlive.value) {
                const res2 = await getToken({
                    username: form.username.trim(),
                    password: form.password.trim(),
                })
                if (res2.data.verified) {
                    const user = await getUser(parseInt(res2.data.user_id))
                    userStore.setUser(user.data)
                    const refreshedhToken = await refreshToken({
                        refresh: res2.data.refresh,
                    })
                    localStorage.setItem('wsy-token', refreshedhToken.data.access)
                }
            }
            successNotify(res.data.msg)
            form.username = ''
            form.password = ''
            form.email = ''
            emits('afterRegister')
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
            errorNotify('出错啦！请稍后重试')
        }
    }
}
</script>
