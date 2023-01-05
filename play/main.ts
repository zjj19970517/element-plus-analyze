import { createApp } from 'vue'
import '@element-plus/theme-chalk/src/dark/css-vars.scss'
  ; (async () => {
    // 匹配到 src 下所有 vue 文件
    const apps = import.meta.glob('./src/*.vue')

    // location.pathname  ===> 组件命名 name
    const name = location.pathname.replace(/^\//, '') || 'App'
    // 获取对应的文件
    const file = apps[`./src/${name}.vue`]
    if (!file) {
      location.pathname = 'App'
      return
    }
    // 异步加载后
    const App = (await file()).default
    // 实例化 App
    const app = createApp(App)
    app.mount('#play')
  })()
