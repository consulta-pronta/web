import type { UserType } from "@/components/ToggleUser.vue"
import { db } from "@/config/firebase"
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore"
import type {FieldValue, Timestamp} from "firebase/firestore"

 // TODO: setup Cloud Storage for storing photo url
export type User = {
	readonly uid: string
	email: string
	phone: string
	cpf: string
	user_type: UserType
	photo_url: string | null
	created_at: Timestamp
}

export type UserData = {
	name?: string
	email?: string
	phone?: string
	cpf?: string
	user_type?: UserType
	photo_url?: string | null,
	created_at?: FieldValue
}

const getUserRef = (uid: string) => { return doc(db, "users", uid) }


export const createUser = async (uid: string, data: UserData) => {
	data.created_at = serverTimestamp()
	await setDoc(getUserRef(uid), data)
}

export const getUser = async (uid: string) => {
	const userSnap = await getDoc(getUserRef(uid))

	return userSnap.data() as User ?? {}
}

export const updateUser = async (uid: string, data: UserData) => {
	await updateDoc(getUserRef(uid), data)
}

export const deleteUser = async (uid: string) => {
	await deleteDoc(getUserRef(uid))
}