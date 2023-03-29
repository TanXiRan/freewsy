import axios, { AxiosHeaders, AxiosError } from 'axios'

// const isDevelopment = process.env.NODE_ENV === 'development' || !!process.env.VSCODE_DEBUG

const instance = axios.create({
    // baseURL: isDevelopment ? '/v3' : 'http://www.tanhong.cc/v3/',
    // baseURL: '/v3',
    baseURL: 'http://www.tanhong.cc/v3/',
    timeout: 10000,
})

instance.defaults.headers.post['Content-Type'] = 'application/json'

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('wsy-token') || null
    if (token) (config.headers! as AxiosHeaders).set('Authorization', `Bearer ${token}`)
    return config
})

instance.interceptors.response.use(
    (config) => {
        return config
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

export default instance
