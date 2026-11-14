<script setup lang="ts">
import { auth } from "@/database/firebase"
import router from "@/router"
import { signOut } from "firebase/auth"
import { onMounted } from "vue"

const logout = async () => {
	try {
		await signOut(auth)
		router.replace("/login")
	} catch (error) {
		console.error(error)
	}
}

onMounted(logout)
</script>