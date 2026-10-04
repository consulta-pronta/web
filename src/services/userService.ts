import type { UserType } from "@/components/ToggleUser.vue"
import { db } from "@/config/firebase"
import { collection, deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore"
import type { FieldValue, Timestamp } from "firebase/firestore"
import { computed } from "vue"

// TODO: setup Cloud Storage for storing photo url
export type User = {
	id: string
	name: string
	email: string
	phone: string
	cpf: string
	address?: string
	user_type: UserType
	photo_url: string | null
	created_at: Timestamp
}

export type UserData = {
	name?: string
	email?: string
	phone?: string
	cpf?: string
	address?: string
	user_type?: UserType
	photo_url?: string | null
	created_at?: FieldValue
}

export type ProfessionalData = UserData & {
	data_profissional: {
		crm?: string
		uf?: string
		local_atuacao?: string
	}
}

export type PatientData = UserData & {
	data_paciente: {
		peso?: number
		altura?: number
		tipo_sanguineo?: string
	}
}


export const getUserRef = (uid: string) => {
	return doc(db, "users", uid)
}

export const signUpRequestsRef = computed(
	() => collection(db, "signupRequests")
)
	

export const createUser = async (uid: string, data: UserData) => {
	data.created_at = serverTimestamp()
	await setDoc(getUserRef(uid), data)
}

export const getUser = async (uid: string) => {
	const userSnap = await getDoc(getUserRef(uid))
	const user = (userSnap.data() as User) ?? {}
	user.id = uid

	return user
}

export const updateUser = async (uid: string, data: UserData) => {
	await updateDoc(getUserRef(uid), data)
}

export const deleteUser = async (uid: string) => {
	await deleteDoc(getUserRef(uid))
}

export const createPatient = async (uid: string, data: PatientData) => {
	data.created_at = serverTimestamp()
	await setDoc(getUserRef(uid), data)
}

export const createProfessionalSignUpRequest = async (uid: string, data: ProfessionalData) => {
	const requestDoc = doc(signUpRequestsRef.value, uid)
	await setDoc(requestDoc, data)
	
	return requestDoc.id
}