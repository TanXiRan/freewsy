import { rmSync } from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import pkg from './package.json'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
import postcsspxtoviewport from 'postcss-px-to-viewport'
import { visualizer } from 'rollup-plugin-visualizer'
import { terser } from 'rollup-plugin-terser'

rmSync('dist-electron', { recursive: true, force: true })

const isDevelopment = process.env.NODE_ENV === 'development' || !!process.env.VSCODE_DEBUG
const isProduction = process.env.NODE_ENV === 'production'

console.log(process.env.NODE_ENV)
console.log(process.env.VSCODE_DEBUG)
console.log(isDevelopment, isProduction)

export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ArcoResolver()],
        }),
        Components({
            resolvers: [
                ArcoResolver({
                    sideEffect: true,
                }),
            ],
        }),
        electron([
            {
                // Main-Process entry file of the Electron App.
                entry: 'electron/main/index.ts',
                onstart(options) {
                    if (process.env.VSCODE_DEBUG) {
                        console.log(/* For `.vscode/.debug.script.mjs` */ '[startup] Electron App')
                    } else {
                        options.startup()
                    }
                },
                vite: {
                    build: {
                        sourcemap: isDevelopment,
                        minify: isProduction,
                        outDir: 'dist-electron/main',
                        rollupOptions: {
                            external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
                            plugins: [
                                isProduction &&
                                    terser({
                                        compress: {
                                            drop_console: isProduction,
                                        },
                                    }),
                            ],
                        },
                    },
                },
            },
            {
                entry: 'electron/preload/index.ts',
                onstart(options) {
                    // 在预加载脚本构建完成后，通知渲染器程序重新加载页面，
                    // 而不是重新启动整个Electron应用程序。
                    options.reload()
                },
                vite: {
                    build: {
                        sourcemap: isDevelopment,
                        minify: isProduction,
                        outDir: 'dist-electron/preload',
                        rollupOptions: {
                            external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
                            plugins: [
                                isProduction &&
                                    terser({
                                        compress: {
                                            drop_console: isProduction,
                                        },
                                    }),
                            ],
                        },
                    },
                },
            },
        ]),
        visualizer({
            open: true,
        }),
    ],

    server: isDevelopment
        ? {
              proxy: {
                  '/v3': {
                      target: pkg.debug.env.VITE_DEV_SERVER_URL,
                      changeOrigin: true,
                  },
              },
          }
        : {},

    // server: {
    //     proxy: {
    //         '/v3': {
    //             target: pkg.debug.env.VITE_DEV_SERVER_URL,
    //             changeOrigin: true,
    //         },
    //     },
    // },

    clearScreen: false,

    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    css: {
        postcss: {
            plugins: [
                postcsspxtoviewport({
                    unitToConvert: 'px', // 要转化的单位
                    viewportWidth: 1280, // UI设计稿的宽度
                    unitPrecision: 6, // 转换后的精度，即小数点位数
                    propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
                    viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
                    fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
                    selectorBlackList: ['ignore-'], // 指定不转换为视窗单位的类名，
                    minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
                    mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
                    replace: true, // 是否转换后直接更换属性值
                    landscape: false, // 是否处理横屏情况
                }),
            ],
        },
    },
})
