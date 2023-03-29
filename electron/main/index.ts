import { app, BrowserWindow, shell, ipcMain, Menu, dialog } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
const URL = require('url').URL

process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, '../public')
    : process.env.DIST

// 为Windows7禁用GPU加速
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// 为Windows10+通知设置应用程序名称
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

let win: BrowserWindow | null = null
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

// 创建窗口的异步函数
async function createWindow() {
    win = new BrowserWindow({
        // 如果index.html设置了title标签，这个title就会被忽略
        title: 'Main window',
        // 应用打包后的应用图标
        icon: join(process.env.PUBLIC, 'favicon.ico'),
        webPreferences: {
            preload,
        },
    })
    console.log(process.env.VITE_DEV_SERVER_URL, 'server')
    if (process.env.VITE_DEV_SERVER_URL) {
        // electron-vite-vue#298
        win.loadURL(url)
        // 如果应用程序未打包，打开devTool
        win.webContents.openDevTools()
    } else {
        win.loadFile(indexHtml)
    }

    // Test actively push message to the Electron-Renderer
    // 测试主动将消息推送到electron渲染器
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send(
            'main-process-message',
            new Date().toLocaleString()
        )
    })

    // 使用浏览器打开所有链接而不是使用应用程序
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:') || url.startsWith('http:'))
            shell.openExternal(url)
        return { action: 'deny' }
    })

    // const menu = Menu.buildFromTemplate([
    //     {
    //         label: app.name,
    //         submenu: [
    //             {
    //                 click: () => win.webContents.send('update-counter', 1),
    //                 label: 'Increment',
    //             },
    //             {
    //                 click: () => win.webContents.send('update-counter', -1),
    //                 label: 'Decrement',
    //             },
    //         ],
    //     },
    // ])
    // Menu.setApplicationMenu(menu)
}

// app准备完毕后，创建窗口
app.whenReady().then(() => {
    ipcMain.on('counter-value', (_event, value) => {
        console.log(value)
    })
    createWindow()

    app.on('activate', () => {
        const allWindows = BrowserWindow.getAllWindows()
        if (allWindows.length) {
            allWindows[0].focus()
        } else {
            createWindow()
        }
    })
})

//  禁用或限制网页跳转
app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl)
        if (
            !process.env.VITE_DEV_SERVER_URL &&
            parsedUrl.origin !== 'http://www.tanhong.cc'
        ) {
            event.preventDefault()
        }
    })
})

// 当非macOS平台上没有打开窗口时退出应用程序
app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
})

//
app.on('second-instance', () => {
    if (win) {
        // 如果用户尝试打开另一个窗口，请专注于主窗口
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

// 验证所有 IPC 消息的 sender
function validateSender(frame: Electron.WebFrameMain) {
    const host = new URL(frame.url).host
    console.log(host)
    if (
        host === 'http://www.tang.cc' ||
        host === process.env.VITE_DEV_SERVER_URL
    )
        return true
    return false
}

// New window example arg: new windows url
ipcMain.handle('open-win', (e, arg) => {
    if (!validateSender(e.senderFrame)) return null
    const childWindow = new BrowserWindow({
        icon: join(process.env.PUBLIC, 'favicon.ico'),
        webPreferences: {
            preload,
            // nodeIntegration: true,
            // contextIsolation: false,
        },
    })
    if (process.env.VITE_DEV_SERVER_URL) {
        childWindow.loadURL(`${url}#${arg}`)
    } else {
        childWindow.loadFile(indexHtml, { hash: arg })
    }
})

ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
})

// async function handleFileOpen() {
//     const { canceled, filePaths } = await dialog.showOpenDialog(win, {
//         title: '打开文件',
//     })
//     if (canceled) {
//         return
//     } else {
//         return filePaths[0]
//     }
// }

// ipcMain.handle('dialog:openFile', handleFileOpen)
