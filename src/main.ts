import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import '@arco-design/web-vue/es/notification/style/css.js'
import global from './plugin/global'
import arcoicon from './plugin/arcoicon'
import { createPinia } from 'pinia'

type Cb = (evt: Electron.IpcRendererEvent, value: number) => void

export interface IElectronAPI {
    setTitle: (title: string) => void
    // handleCounter: (cb: Cb) => void
    // openFile: () => Promise<string>
    // finishLoad: (cb: Cb) => void
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}

const pinia = createPinia()
const app = createApp(App)

app.use(router)
    .use(arcoicon)
    .use(pinia)
    .use(global)
    .mount('#app')
    .$nextTick(() => {
        postMessage({ payload: 'removeLoading' }, '*')
    })
