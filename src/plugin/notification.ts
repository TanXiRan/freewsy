import { h } from 'vue'
import { Button, Notification } from '@arco-design/web-vue'

type NotifyPosition =
    | 'topRight'
    | 'topLeft'
    | 'bottomLeft'
    | 'bottomRight'
    | undefined

const infoNotify = (
    title: string,
    content: string,
    closable: boolean = true,
    position: NotifyPosition = 'topRight'
) => {
    Notification.clear()
    Notification.info({
        title,
        content,
        closable,
        position,
        closeIconElement: () => h(Button, { size: 'mini', innerHTML: '关闭' }),
    })
}

const successNotify = (
    content: string,
    closable: boolean = true,
    position: NotifyPosition = 'topRight'
) => {
    Notification.clear()
    Notification.success({
        content,
        closable,
        position,
        closeIconElement: () => h(Button, { size: 'mini', innerHTML: '关闭' }),
    })
}

const errorNotify = (
    content: string,
    closable: boolean = true,
    position: NotifyPosition = 'topRight',
    duration: number = 3000
) => {
    Notification.clear()
    Notification.error({
        content,
        closable,
        position,
        duration,
        closeIconElement: () => h(Button, { size: 'mini', innerHTML: '关闭' }),
    })
}
export { infoNotify, successNotify, errorNotify }
