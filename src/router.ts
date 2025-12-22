import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import AddSub from './views/AddSub.vue'
import ResView from './views/ResView.vue'

const routes: RouteRecordRaw[] = [
    { path: '/', name: 'addSub', component: AddSub },
    { path: '/:resultString', name: 'res', component: ResView, props: true }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})


