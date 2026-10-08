import { defineStore } from "pinia"
import { computed, ref } from "vue"
import {
	createUserWithEmailAndPassword,
	sendEmailVerification,
	validatePassword,
} from "firebase/auth"
import { auth } from "@/config/firebase"
import Patient from "@/models/patient.model"
import Professional from "@/models/professional.model"
import { Timestamp } from "firebase/firestore"
import { isCPF, isPhone } from "brazilian-values"
import type { UserType } from "@/utils"

export type PasswordRules = {
	minLength: boolean
	hasNumber: boolean
	hasLowercase: boolean
	hasUppercase: boolean
	match: boolean
}
export const minPasswordLength = 8
export const maxPasswordLength = 4096

const emptyProfessionalData = () => ({ crm: "", uf: "", operation_area: "" })
const emptyPatientData = () => ({ weight: "", height: "", blood_type: "" })

export const useSignUpStore = defineStore("sign_up", () => {
	const name = ref("")
	const email = ref("")
	const password = ref("")
	const confirmPassword = ref("")
	const phone = ref("")
	const cpf = ref("")
	const professionalData = ref(emptyProfessionalData())
	const patientData = ref(emptyPatientData())
	const userType = ref<UserType>("patient")

	const rules = computed(
		() =>
			({
				minLength: password.value.length >= minPasswordLength,
				hasNumber: /\d/.test(password.value),
				hasLowercase: /[a-z]/.test(password.value),
				hasUppercase: /[A-Z]/.test(password.value),
				match: password.value === confirmPassword.value && password.value.length > 0,
			}) as PasswordRules,
	)

	const isPasswordInvalid = computed(() => {
		return Object.values(rules.value).includes(false)
	})

	const clearForm = () => {
		name.value = ""
		email.value = ""
		password.value = ""
		confirmPassword.value = ""
		phone.value = ""
		cpf.value = ""
		professionalData.value = emptyProfessionalData()
		patientData.value = emptyPatientData()
		userType.value = "patient"
	}

	const isCpfInvalid = computed(() => !isCPF(cpf.value))
	const isPhoneInvalid = computed(() => !isPhone(phone.value))

	async function submitForm() {
		const passwordStatus = await validatePassword(auth, password.value)
		if (!passwordStatus.isValid) {
			throw Error("Invalid password.")
		}

		const userData = {
			name: name.value,
			email: email.value,
			phone: phone.value.replace(/[\(\)\-\s]/g, ""),
			cpf: cpf.value.replace(/[.\-\s]/g, ""),
			user_type: userType.value,
			created_at: Timestamp.now(),
		}

		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email.value,
			password.value,
		)
		const user = userCredential.user

		await sendEmailVerification(user)
		console.log(`Successfuly created user of id ${user.uid}, see email sent to verify account.`)

		if (userType.value === "professional") {
			await Professional.createRequest(user.uid, {
				...userData,
				professional_data: professionalData.value,
			})
		} else {
			await Patient.create(user.uid, {
				...userData,
				patient_data: patientData.value,
			})
		}
	}

	return {
		email,
		password,
		confirmPassword,
		name,
		cpf,
		professionalData,
		patientData,
		phone,
		userType,
		rules,
		isPasswordInvalid,
		isCpfInvalid,
		isPhoneInvalid,
		clearForm,
		submitForm,
	}
})
