import { contextBridge, ipcRenderer } from 'electron'

function useLoading() {
    const styleContent = `
    html, body, .app {
        magin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body {
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #e8e8e8;
    }
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #212121;
      }
    }
    .boxes {
        --size: 32px;
        --duration: 3000ms;
        height: calc(var(--size) * 2);
        width: calc(var(--size) * 3);
        position: relative;
        transform-style: preserve-3d;
        transform-origin: 50% 50%;
        margin-top: calc(var(--size) * 1.5 * -1);
        transform: rotateX(60deg) rotateZ(45deg) rotateY(0deg) translateZ(0px);
      }
      
      .boxes .box {
        width: var(--size);
        height: var(--size);
        top: 0;
        left: 0;
        position: absolute;
        transform-style: preserve-3d;
      }
      
      .boxes .box:nth-child(1) {
        transform: translate(100%, 0);
        -webkit-animation: box1 var(--duration) linear infinite;
        animation: box1 var(--duration) linear infinite;
      }
      
      .boxes .box:nth-child(2) {
        transform: translate(0, 100%);
        -webkit-animation: box2 var(--duration) linear infinite;
        animation: box2 var(--duration) linear infinite;
      }
      
      .boxes .box:nth-child(3) {
        transform: translate(100%, 100%);
        -webkit-animation: box3 var(--duration) linear infinite;
        animation: box3 var(--duration) linear infinite;
      }
      
      .boxes .box:nth-child(4) {
        transform: translate(200%, 0);
        -webkit-animation: box4 var(--duration) linear infinite;
        animation: box4 var(--duration) linear infinite;
      }
      
      .boxes .box > div {
        --background: #5C8DF6;
        --top: auto;
        --right: auto;
        --bottom: auto;
        --left: auto;
        --translateZ: calc(var(--size) / 2);
        --rotateY: 0deg;
        --rotateX: 0deg;
        position: absolute;
        width: 100%;
        height: 100%;
        background: var(--background);
        top: var(--top);
        right: var(--right);
        bottom: var(--bottom);
        left: var(--left);
        transform: rotateY(var(--rotateY)) rotateX(var(--rotateX)) translateZ(var(--translateZ));
      }
      
      .boxes .box > div:nth-child(1) {
        --top: 0;
        --left: 0;
      }
      
      .boxes .box > div:nth-child(2) {
        --background: #145af2;
        --right: 0;
        --rotateY: 90deg;
      }
      
      .boxes .box > div:nth-child(3) {
        --background: #447cf5;
        --rotateX: -90deg;
      }
      
      .boxes .box > div:nth-child(4) {
        --background: #DBE3F4;
        --top: 0;
        --left: 0;
        --translateZ: calc(var(--size) * 3 * -1);
      }
      
      @-webkit-keyframes box1 {
        0%, 50% {
          transform: translate(100%, 0);
        }
      
        100% {
          transform: translate(200%, 0);
        }
      }
      
      @keyframes box1 {
        0%, 50% {
          transform: translate(100%, 0);
        }
      
        100% {
          transform: translate(200%, 0);
        }
      }
      
      @-webkit-keyframes box2 {
        0% {
          transform: translate(0, 100%);
        }
      
        50% {
          transform: translate(0, 0);
        }
      
        100% {
          transform: translate(100%, 0);
        }
      }
      
      @keyframes box2 {
        0% {
          transform: translate(0, 100%);
        }
      
        50% {
          transform: translate(0, 0);
        }
      
        100% {
          transform: translate(100%, 0);
        }
      }
      
      @-webkit-keyframes box3 {
        0%, 50% {
          transform: translate(100%, 100%);
        }
      
        100% {
          transform: translate(0, 100%);
        }
      }
      
      @keyframes box3 {
        0%, 50% {
          transform: translate(100%, 100%);
        }
      
        100% {
          transform: translate(0, 100%);
        }
      }
      
      @-webkit-keyframes box4 {
        0% {
          transform: translate(200%, 0);
        }
      
        50% {
          transform: translate(200%, 100%);
        }
      
        100% {
          transform: translate(100%, 100%);
        }
      }
      
      @keyframes box4 {
        0% {
          transform: translate(200%, 0);
        }
      
        50% {
          transform: translate(200%, 100%);
        }
      
        100% {
          transform: translate(100%, 100%);
        }
      }
    `
    const style = document.createElement('style')
    const boxes = document.createElement('div')

    style.innerHTML = styleContent

    const box = `
    <div class="box"><div></div><div></div><div></div><div></div></div>
    `
    let innerhtml = '<div class="boxes">'
    for (let i = 0; i < 4; i++) {
        innerhtml = innerhtml + box
    }
    innerhtml = innerhtml + '</div>'
    boxes.innerHTML = innerhtml

    return {
        appendLoading() {
            safeDOM.append(document.head, style)
            safeDOM.append(document.body, boxes)
        },
        removeLoading() {
            safeDOM.remove(document.head, style)
            safeDOM.remove(document.body, boxes)
        },
    }
}
// 检查dom是否状态是否成功
function domReady(
    condition: DocumentReadyState[] = ['complete', 'interactive']
) {
    return new Promise((resolve) => {
        if (condition.includes(document.readyState)) {
            resolve(true)
        } else {
            document.addEventListener('readystatechange', () => {
                if (condition.includes(document.readyState)) {
                    resolve(true)
                }
            })
        }
    })
}

const safeDOM = {
    append(parent: HTMLElement, child: HTMLElement) {
        if (!Array.from(parent.children).find((e) => e === child)) {
            return parent.appendChild(child)
        }
    },
    remove(parent: HTMLElement, child: HTMLElement) {
        if (Array.from(parent.children).find((e) => e === child)) {
            return parent.removeChild(child)
        }
    },
}

// ----------------------------------------------------------------------
type Callback = (evt: Electron.IpcRendererEvent, ...args: any[]) => void
contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title: string) => ipcRenderer.send('set-title', title),
    // openFile: () => ipcRenderer.invoke('dialog:openFile'),
    // // 您可以直接在预加载脚本中调用 ipcRenderer.on ，而不是通过 contextBridge 暴露它。
    // handleCounter: (callback: Callback) => {
    //     console.log(callback)
    //     ipcRenderer.on('update-counter', callback)
    // },
})

ipcRenderer.on('main-process-message', (_event, ...args) => {
    console.log('[Receive Main-process message]:', ...args)
})
const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = (ev) => {
    ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 4999)
