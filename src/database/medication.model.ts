import { onSnapshot, serverTimestamp, type Timestamp } from "firebase/firestore"
import BaseDocument, { type CollectionScope } from "./baseDocument"
import User from "./user.model"

export type MedicationRoute =
    | "Oral"
    | "Sublingual"
    | "Externo"
    | "Inalatorio"
    | "Retal"
    | "Oftalmico"
    | "Oftologico"

export type MedicationDoseUnit =
    | "Miligrama"
    | "Grama"
    | "Micrograma"
    | "Mililitro"
    | "Unidade_Internacional"
    | "Tablete"

// Corrigido: "Frenquency" -> "Frequency"
export type MedicationFrequencyUnit =
    | "Minuto"
    | "Hora"
    | "Dia"
    | "Semana"
    | "Mes"

export default class Medication extends BaseDocument {
    constructor(
        public readonly id: string = "",
        public title: string = "",
        public route: MedicationRoute = "Oral",
        public dose_value: number = 0,
        public dose_unit: MedicationDoseUnit = "Miligrama",
        public frequency_value: number = 0,
        public frequency_unit: MedicationFrequencyUnit = "Hora",
        public duration_days: number = 0,
        public start_at: Timestamp | null = null,
        public custom_instructions: string = "",
        public notes: string = "",
        public taken_dates: Record<string, boolean> = {},
        public registered_in: Timestamp | null = null,
    ) {
        super()
    }

    static readonly collectionName = "Medication"

    protected static getCollectionPath(scope?: CollectionScope): string {
        const userId = scope?.userId

        if (!userId) {
            throw new Error("Medications requires scope.userId")
        }

        return User.resolvePath(userId, this.collectionName)
    }

    protected static documentConverter(
        id: string,
        data: Record<string, any>,
    ): Medication {
        return new Medication(
            id,
            data.title,
            data.route,
            data.dose_value,
            data.dose_unit,
            data.frequency_value,
            data.frequency_unit,
            data.duration_days,
            data.start_at,
            data.custom_instructions,
            data.notes,
            // Documentos sem o campo não podem sobrescrever o padrão com undefined
            data.taken_dates ?? {},
            data.registered_in,
        )
    }

    toMap(): Record<string, unknown> {
        return {
            title: this.title,
            route: this.route,
            dose_value: this.dose_value,
            dose_unit: this.dose_unit,
            frequency_value: this.frequency_value,
            frequency_unit: this.frequency_unit,
            duration_days: this.duration_days,
            start_at: this.start_at,
            custom_instructions: this.custom_instructions,
            notes: this.notes,
            taken_dates: this.taken_dates,
            registered_in: this.registered_in ?? serverTimestamp(),
        }
    }

    // Escuta alterações na coleção de medicamentos em tempo real
    static listen(
        userId: string,
        callback: (medications: Medication[]) => void,
    ) {
        return onSnapshot(
            this.collection({ scope: { userId } }),
            (snapshot) => {
                const medications = snapshot.docs.map(
                    (document) => this.fromDocument<Medication>(document)!
                )

                callback(medications)
            },
        )
    }

    // Atualiza o estado de uma dose específica
    static async updateDose(
        userId: string,
        medicationId: string,
        doseKey: string,
        taken: boolean,
    ) {
        await this.update(
            medicationId,
            {
                [`taken_dates.${doseKey}`]: taken,
            },
            { scope: { userId } },
        )
    }
}

// Adiciona a frequência ao horário informado
function addFrequency(date: Date, medication: Medication): Date {
    const next = new Date(date)

    switch (medication.frequency_unit) {
        case "Minuto":
            next.setMinutes(next.getMinutes() + medication.frequency_value)
            break

        case "Hora":
            next.setHours(next.getHours() + medication.frequency_value)
            break

        case "Dia":
            next.setDate(next.getDate() + medication.frequency_value)
            break

        case "Semana":
            next.setDate(next.getDate() + medication.frequency_value * 7)
            break

        case "Mes":
            next.setMonth(next.getMonth() + medication.frequency_value)
            break
    }

    return next
}

// Formata a data para identificar individualmente cada dose
function formatDateKey(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")

    return `${year}-${month}-${day}T${hours}:${minutes}`
}

// Retorna os horários das doses de um medicamento em uma data específica
export function getMedicationSchedule(
    medication: Medication,
    selectedDate: string,
) {
    if (!medication.start_at || medication.frequency_value <= 0) {
        return []
    }

    const start = medication.start_at.toDate()
    const end = new Date(start)

    end.setDate(end.getDate() + medication.duration_days)

    const doses: {
        key: string
        time: string
        taken: boolean
    }[] = []

    let current = new Date(start)

    while (current < end) {
        const key = formatDateKey(current)

        if (key.startsWith(selectedDate)) {
            doses.push({
                key,
                time: current.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                // Proteção extra caso taken_dates venha undefined
                taken: medication.taken_dates?.[key] ?? false,
            })
        }

        current = addFrequency(current, medication)
    }

    return doses
}
