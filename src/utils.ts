import { formatDate } from "@vueuse/core"
import type { Timestamp } from "firebase/firestore"

export const inputDateToDate = (date: string) => new Date(`${date}T00:00`)

export const toCoolDate = (date: Date) => 
	formatDate(date, "DD MMM YYYY")

export const timestampDiffSeconds = (start: Timestamp, end: Timestamp) =>
	(end.toMillis() - start.toMillis()) / 1000

export const timestampDiffDays = (start: Timestamp, end: Timestamp) =>
	timestampDiffSeconds(start, end) / (60 * 60 * 24)