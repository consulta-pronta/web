import { formatDate } from "@vueuse/core"
import type { Timestamp } from "firebase/firestore"

export const DATE_NOT_PROVIDED = "Data não informada"

export const inputDateToDate = (date: string) => new Date(`${date}T00:00`)

export const toCoolDate = (date: Date) => 
	formatDate(date, "DD MMM YYYY")

export const toBrazilianLocaleDate = (date: Date) =>
	formatDate(date, "d 'de' MMM 'de' yyyy")

export const timestampDiffSeconds = (start: Timestamp, end: Timestamp) =>
	(end.toMillis() - start.toMillis()) / 1000

export const timestampDiffDays = (start: Timestamp, end: Timestamp) =>
	timestampDiffSeconds(start, end) / (60 * 60 * 24)