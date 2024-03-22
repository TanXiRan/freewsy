import { AxiosError } from 'axios'
import { errorNotify } from './notification'
// import { useGlobleStore } from '@/stores'

// const store = useGlobleStore()

/**
 * 处理接口请求异常
 * @param error AxiosError对象
 * @param msg 错误提示消息
 */
function handleResError(error: AxiosError, msg: string | null = null) {
    const status = error?.response?.status

    if (status) {
        switch (status) {
            case 400:
                errorNotify(msg ? msg : '请输入合法的数据！')
                break
            case 404:
                errorNotify('不存在该页面')
                break
            case 500:
                errorNotify('内部服务器错误！')
                break
            case 403:
                errorNotify('登录信息失效，请重新登陆！')
                break
            case 401:
                errorNotify('账号或密码错误，请重试！')
                break
            default:
                errorNotify('出错，请退出应用后重试！')
        }
    } else if (error?.code === 'ECONNABORTED' || error?.message === 'Network Error' || error?.message.includes('timeout')) {
        errorNotify('网络超时，请检查您的网络连接！')
        // store.$patch({ netError: true })
    } else {
        errorNotify('出错啦！请退出应用后重试')
    }
}

export { handleResError }
