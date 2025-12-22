/*
 * @Author: NMTuan
 * @Email: NMTuan@qq.com
 * @Date: 2022-06-21 19:41:22
 * @LastEditTime: 2022-06-27 11:36:46
 * @LastEditors: NMTuan
 * @Description:
 * @FilePath: \math_test_questions_generator\vite.config.ts
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    server: {
        host: '0.0.0.0'
    },
    plugins: [vue(), Unocss()],
    build: {
        outDir: 'docs'
    }
})
