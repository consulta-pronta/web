import type { UserType } from "@/components/ToggleUser.vue"
import { db } from "@/config/firebase"
import { collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore"
import type { FieldValue, Timestamp } from "firebase/firestore"
import { computed } from "vue"

export type Admin = {
	id: string,
	name: string,
	email: string,
	user_type: UserType,
}

// TODO: setup Firebase Auth for storing photo url
export type User = {
	id: string
	name: string
	email: string
	phone: string
	cpf: string
	address?: string
	user_type: UserType
	photo_url?: string
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

export type ProfessionalData = {
	id: string
	name: string
	email: string
	phone: string
	cpf: string
	user_type: UserType
	created_at: Timestamp
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


export const getUserRef = (uid: string) => doc(db, "users", uid)

export const getAdminRef = (uid: string) => doc(db, "admins", uid)

export const signUpRequestsRef = computed(
	() => collection(db, "signupRequests")
)
	

export const createUser = async (uid: string, data: UserData) => {
	data.created_at = serverTimestamp()
	await setDoc(getUserRef(uid), data)
}

export const getUser = async (uid: string) => {
	const userSnap = await getDoc(getUserRef(uid))
	if (userSnap.exists()) {
		return { ...userSnap.data(), id: uid } as User
	}

	const adminSnap = await getDoc(getAdminRef(uid))
	if (adminSnap.exists()) {
		return <Admin>{
			...adminSnap.data(),
			id: uid,
			user_type: "admin"
		}
	}

	return null
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

export const getSignUpRequests = async () => {
	const requestSnap = await getDocs(signUpRequestsRef.value)
	if (requestSnap.empty) {
		return []
	}
	
	const documents = requestSnap.docs.map((document) => {
		return {
			id: document.id,
			...document.data(),
		} as ProfessionalData
	})

	return documents
}