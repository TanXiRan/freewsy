type Cb = (evt: Electron.IpcRendererEvent, value: number) => void

export interface IElectronAPI {
    setTitle: (title: string) => void
    handleCounter: (cb: Cb) => void
    openFile: () => Promise<string>
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}
