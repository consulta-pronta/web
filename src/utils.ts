import { formatDate } from "@vueuse/core"
import type { Timestamp } from "firebase/firestore"
import type BaseDocument from "./database/baseDocument"

export const federalUnits = [
	"AC",
	"AL",
	"AP",
	"AM",
	"BA",
	"CE",
	"DF",
	"ES",
	"GO",
	"MA",
	"MT",
	"MS",
	"MG",
	"PA",
	"PB",
	"PR",
	"PE",
	"PI",
	"RJ",
	"RN",
	"RS",
	"RO",
	"RR",
	"SC",
	"SP",
	"SE",
	"TO",
] as const
export const symptomPlaces = [
	"Cabeça",
	"Rosto",
	"Pescoço",
	"Tórax",
	"Abdômen",
	"Costas",
	"Ombro",
	"Braço",
	"Antebraço",
	"Mão",
	"Coxa",
	"Perna",
	"Tornozelo",
	"Pé",
	"Nádegas",
	"Vagina",
	"Pênis",
] as const
export const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const
export const userTypes = ["patient", "professional", "admin"] as const
export const DATE_NOT_PROVIDED = "Data não informada"

export type FederalUnit = (typeof federalUnits)[number]
export type SymptomPlace = (typeof symptomPlaces)[number]
export type BloodType = (typeof bloodTypes)[number]
export type UserType = (typeof userTypes)[number]
export type SortDirection = "asc" | "desc"

export const inputDateToDate = (date: string) => new Date(`${date}T00:00`)

export const toCoolDate = (date: Date | null | undefined) =>
	date ? formatDate(date, "DD MMM YYYY") : DATE_NOT_PROVIDED

export const toBrazilianDate = (date: Date | null | undefined) =>
	date ? date.toLocaleString("pt-BR") : DATE_NOT_PROVIDED

export const toBrazilianLocaleDate = (date: Date | null | undefined) =>
	date ? formatDate(date, "D [de] MMM [de] YYYY") : DATE_NOT_PROVIDED

export const normalizeString = (value: string) =>
	value
		.normalize()
		.replace(/\p{Diacritic}/gu, "")
		.toLocaleLowerCase()
		.trim()

export const timestampDiffSeconds = (start: Timestamp, end: Timestamp, reversed = false) =>
	(end.toMillis() - start.toMillis()) / 1000 * (reversed ? -1 : 1)

export const timestampDiffDays = (start: Timestamp, end: Timestamp) =>
	timestampDiffSeconds(start, end) / (60 * 60 * 24)

export const formatCRM = (crm: string, uf: string) => `${crm}/${uf}`

export const changeTitle = (title: string) => document.title = title

export const searchDocuments = (docs: BaseDocument[], query: string) => {
	const normalizedQuery = normalizeString(query)
	return docs.filter((doc) => doc.search(normalizedQuery, true))
}
