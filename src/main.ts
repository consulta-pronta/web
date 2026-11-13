import { createApp } from "vue"
import { createPinia } from "pinia"

import App from "./App.vue"
import router from "./router"
import "./assets/main.css"
import "material-symbols/rounded.css"
import "@imengyu/vue3-context-menu/lib/vue3-context-menu.css"
import { useAuthStore } from "./stores/authStore.ts"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./database/firebase.ts"
import ContextMenu from "@imengyu/vue3-context-menu"

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ContextMenu)

const authStore = useAuthStore()
onAuthStateChanged(auth, (user) => {
	authStore.setUser(user)
})

app.mount("#app")
