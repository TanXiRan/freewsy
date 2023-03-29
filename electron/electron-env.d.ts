/// <reference types="vite-plugin-electron/electron-env" />

// 为process.env声明接口，这里不会覆盖，求的是并集
declare namespace NodeJS {
    interface ProcessEnv {
        VSCODE_DEBUG?: 'true'
        DIST_ELECTRON: string
        DIST: string
        /** /dist/ or /public/ */
        PUBLIC: string
    }
}
