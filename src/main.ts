import { createApp } from "vue"
import { createPinia } from "pinia"

import App from "./App.vue"
import router from "./router"
import "./assets/main.css"
import "material-symbols/rounded.css"
// import "@imengyu/vue3-context-menu/lib/vue3-context-menu.css"
import "vue-toastification/dist/index.css"
import { useAuthStore } from "./stores/authStore.ts"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./database/firebase.ts"
import ContextMenu from "@imengyu/vue3-context-menu"
import Toast, { type PluginOptions } from "vue-toastification"

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ContextMenu)
app.use(Toast, <PluginOptions>{
	timeout: 3000,
	toastClassName: "custom-toast",
})

const authStore = useAuthStore()
onAuthStateChanged(auth, (user) => {
	authStore.setUser(user)
})

app.mount("#app")
