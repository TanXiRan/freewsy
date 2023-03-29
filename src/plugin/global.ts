import { useUserStore } from '@/stores'
import { verifyToken, getUser } from '@/request/api'
import { errorNotify } from '@/plugin/notification'
import type { App } from 'vue'
import { isAxiosError } from 'axios'
import { handleResError } from './ff'

export default {
    install: async (app: App, options: Array<any>) => {
        const themeMedia = window.matchMedia('(prefers-color-scheme: light)')
        // 检测系统主题
        if (!themeMedia.matches) {
            // 当前是暗模式
            document.body.setAttribute('arco-theme', 'dark')
            document.body.setAttribute('color-theme', 'dark')
        }
        themeMedia.addEventListener('change', (e) => {
            if (e.matches) {
                console.log('light')
                document.body.removeAttribute('arco-theme')
                document.body.removeAttribute('color-theme')
            } else {
                console.log('dark')
                document.body.setAttribute('arco-theme', 'dark')
                document.body.setAttribute('color-theme', 'dark')
            }
        })
        const token = localStorage.getItem('wsy-token') || null
        if (token) {
            try {
                const res = await verifyToken({ token: token })
                // console.log(res)
                if (res.data.verified) {
                    const exp = new Date(parseInt(res.data.exp) * 1000).getTime()
                    // console.log(exp)
                    const now = new Date().getTime()
                    const rest = (exp - now) / (24 * 3600 * 1000)
                    // console.log(rest)
                    if (rest < 1) {
                        {
                            localStorage.removeItem('wsy-token')
                            setTimeout(() => {
                                errorNotify(`登录信息失效，请重新登录！`)
                            }, 200)
                            return
                        }
                    }
                    const userStore = useUserStore()
                    const res2 = await getUser(res.data.user_id)
                    // console.log(res2.data)
                    userStore.setUser(res2.data)
                    return
                }
                localStorage.removeItem('wsy-token')
            } catch (err) {
                console.log(err)
                if (isAxiosError(err)) {
                    handleResError(err)
                } else {
                    console.log(err)
                    errorNotify('出错啦！请退出应用后重试')
                }
            }
        }
    },
}
