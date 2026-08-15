import { defineStore } from "pinia"
import { ref } from "vue"
import { createUserWithEmailAndPassword, sendEmailVerification, validatePassword } from "firebase/auth"
import { auth } from "@/config/firebase"


export const useSignUpStore = defineStore("sign_up", () => {
	const email = ref("")
	const password = ref("")
	const confirmPassword = ref("")
	const violations = {
		minPassword: false,
		maxPassword: false,
		numeric: false,
		lowercase: false,
		uppercase: false,
		special: false,
		passwordMatch: false,
    	}


	function resetForm() {
		email.value = ""
		password.value = ""
		confirmPassword.value = ""
	}

	async function isPasswordValid() {
		const status = await validatePassword(auth, password.value)
		const rules = status.passwordPolicy.customStrengthOptions

		violations.minPassword = !status.meetsMinPasswordLength
		violations.maxPassword = !status.meetsMaxPasswordLength
		violations.numeric = !!(
			rules.containsNumericCharacter
			&& !status.containsNumericCharacter
		)
		violations.lowercase = !!(
			rules.containsLowercaseLetter
			&& !status.containsLowercaseLetter
		)
		violations.uppercase = !!(
			rules.containsUppercaseLetter
			&& !status.containsUppercaseLetter
		)
		violations.special = !!(
			rules.containsNonAlphanumericCharacter
			&& !status.containsNonAlphanumericCharacter
		)
		violations.passwordMatch = password.value !== confirmPassword.value
		
		return !Object.values(violations).includes(true)
	}

	async function submitForm() {
		if (!(await isPasswordValid())) {
			console.error(violations)
			return
		}

		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email.value, password.value
		)
		const user = userCredential.user
		console.log(`Successfuly created user of id ${user.uid}`)

		await sendEmailVerification(user)
	}


	return { email, password, confirmPassword, resetForm, submitForm }
})