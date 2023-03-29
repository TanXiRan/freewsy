import type { App } from 'vue'
import {
    IconCommon,
    IconUser,
    IconMoonFill,
    IconSunFill,
    IconUserAdd,
    IconImport,
    IconEmail,
    IconThumbUp,
    IconHeart,
    IconLock,
    IconCheckCircle,
    IconSoundFill,
    IconCheckCircleFill,
    IconEdit,
    IconFaceFrownFill,
    IconPhone,
} from '@arco-design/web-vue/es/icon'

const iconList = [
    IconCommon,
    IconMoonFill,
    IconSunFill,
    IconUser,
    IconUserAdd,
    IconImport,
    IconEmail,
    IconThumbUp,
    IconHeart,
    IconLock,
    IconCheckCircle,
    IconSoundFill,
    IconCheckCircleFill,
    IconEdit,
    IconFaceFrownFill,
    IconPhone,
]
const iconNameList = [
    'IconCommon',
    'IconMoonFill',
    'IconSunFill',
    'IconUser',
    'IconUserAdd',
    'IconImport',
    'IconEmail',
    'IconThumbUp',
    'IconHeart',
    'IconLock',
    'IconCheckCircle',
    'IconSoundFill',
    'IconCheckCircleFill',
    'IconEdit',
    'IconFaceFrownFill',
    'IconPhone',
]
export default {
    install(app: App, options: Array<any>) {
        for (let i = 0; i < iconList.length; i++) {
            app.component(iconNameList[i], iconList[i])
        }
    },
}
// iconList.forEach((icon) => {
//     app.component(icon)
// })
