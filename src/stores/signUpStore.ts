import { defineStore } from "pinia"
import { computed, ref } from "vue"
import {
	createUserWithEmailAndPassword,
	sendEmailVerification,
	validatePassword,
	type User,
} from "firebase/auth"
import { auth } from "@/config/firebase"
import { createPatient, createProfessionalSignUpRequest, type PatientData, type ProfessionalUserData, type UserData } from "@/services/userService"
import type { UserType } from "@/components/ToggleUser.vue"
import { Timestamp } from "firebase/firestore"
import { isCPF, isPhone } from "brazilian-values"

export type PasswordRules = {
		minLength: boolean,
		hasNumber: boolean,
		hasLowercase: boolean,
		hasUppercase: boolean,
		match: boolean,
}
export const minPasswordLength = 8
export const maxPasswordLength = 4096

export const useSignUpStore = defineStore("sign_up", () => {
	const name = ref("")
	const email = ref("")
	const password = ref("")
	const confirmPassword = ref("")
	const phone = ref("")
	const cpf = ref("")
	const professionalData = ref({
		crm: "",
		uf: "",
		localAtuacao: "",
	})
	const patientData = ref({
		peso: "",
		altura: "",
		tipoSanguineo: "",
	})
	const userType = ref<UserType>("paciente")

	const rules = computed(() => ({
		minLength: password.value.length >= minPasswordLength,
		hasNumber: /\d/.test(password.value),
		hasLowercase: /[a-z]/.test(password.value),
		hasUppercase: /[A-Z]/.test(password.value),
		match: password.value === confirmPassword.value && password.value.length > 0,
	} as PasswordRules))

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
		professionalData.value = {
			crm: "",
			uf: "",
			localAtuacao: "",
		}
		patientData.value = {
			peso: "",
			altura: "",
			tipoSanguineo: "",
		}
		userType.value = "paciente"
	}

	const isCpfInvalid = computed(() => !isCPF(cpf.value))
	const isPhoneInvalid = computed(() => !isPhone(phone.value))

	async function submitForm() {
		const passwordStatus = await validatePassword(auth, password.value)
		if (!passwordStatus.isValid) {
			throw Error("Invalid password.")
		}

		const userData: UserData = {
			name: name.value,
			email: email.value,
			phone: phone.value.replace(/[\(\)\-\s]/g, ""),
			cpf: cpf.value.replace(/[.\-\s]/g, ""),
			user_type: userType.value,
			created_at: Timestamp.now()
		}

		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email.value,
			password.value,
		)
		const user = userCredential.user
		
		await sendEmailVerification(user)
		console.log(`Successfuly created user of id ${user.uid}, see email sent to verify account.`)

		if (userType.value == "profissional") {
			await signupProfessional(user, {
				...userData,
				data_profissional : {
					crm: professionalData.value.crm,
					uf: professionalData.value.uf,
					local_atuacao: professionalData.value.localAtuacao,
				}
			})
		} else {
			await signUpPatient(user, {
				...userData,
				data_paciente: {
					peso: parseFloat(patientData.value.peso),
					altura: parseFloat(patientData.value.altura),
					tipo_sanguineo: patientData.value.tipoSanguineo,
				},
			})
		}
	}

	const signupProfessional = async (user: User, userData: ProfessionalUserData) => {
		const id = await createProfessionalSignUpRequest(user.uid, userData)
		
		console.log(`Successfuly requested signup of id ${id}`)
	}

	const signUpPatient = async (user: User, userData: PatientData) => {
		await createPatient(user.uid, userData)
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
