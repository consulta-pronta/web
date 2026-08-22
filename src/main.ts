import { createApp } from "vue"
import { createPinia } from "pinia"

import App from "./App.vue"
import router from "./router"
import "./assets/main.css"
import "material-symbols/rounded.css"
import { useAuthStore } from "./stores/authStore.ts"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./config/firebase.ts"

const app = createApp(App)

app.use(createPinia())
app.use(router)

const authStore = useAuthStore()
onAuthStateChanged(auth, (user) => {
	authStore.setUser(user)
})

app.mount("#app")
