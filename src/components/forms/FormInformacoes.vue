
<script setup lang="ts">
import { ref } from "vue"
import BaseSelect from "@/components/bases/BaseSelect.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import BaseButton from "@/components/bases/BaseButton.vue"

const bloodType = ref("O")
const rhFactor = ref("positivo")
const height = ref("1,75")
const weight = ref("81")

const allergies = ref([
    "Amendoim",
    "Frutos do mar",
    "Amoxicilina"
])

const familyHistory = ref([
    { relative: "Mãe", condition: "Diabetes" },
    { relative: "Pai", condition: "Hipertensão arterial" }
])

const addAllergy = () => {
    allergies.value.push("")
}

const removeAllergy = (index: number) => {
    allergies.value.splice(index, 1)
}

const addFamilyHistory = () => {
    familyHistory.value.push({
        relative: "",
        condition: ""
    })
}

const removeFamilyHistory = (index: number) => {
    familyHistory.value.splice(index, 1)
}

const emit = defineEmits(["handled-submit"])

const submitForm = () => {
    const healthInfo = {
        bloodType: bloodType.value,
        rhFactor: rhFactor.value,
        allergies: allergies.value.filter(item => item.trim() !== ""),
        height: height.value,
        weight: weight.value,
        familyHistory: familyHistory.value.filter(
            item => item.relative.trim() !== "" ||
                    item.condition.trim() !== ""
        )
    }

    console.log(healthInfo)

    // TODO: Salvar as informações no Firebase.
    emit("handled-submit", healthInfo)
}
</script>

<template>
    <form
        @submit.prevent="submitForm"
        class="flex flex-col gap-2 text-textLight"
    >
        <!-- sangue -->
        <label class="flex flex-col gap-1">
            <span>Seu tipo sanguíneo</span>

            <BaseSelect
                theme="light"
                icon="bloodtype"
                v-model="bloodType"
                required
            >
                <option value="" disabled>Selecione o tipo sanguíneo</option>
                <option value="A">Tipo sanguíneo: A</option>
                <option value="B">Tipo sanguíneo: B</option>
                <option value="AB">Tipo sanguíneo: AB</option>
                <option value="O">Tipo sanguíneo: O</option>
            </BaseSelect>
        </label>

        <!-- rh -->
        <div class="flex items-center justify-between gap-2">
            <span class="text-xs">Fator Rh:</span>

            <div class="flex gap-2">
                <button
                    type="button"
                    @click="rhFactor = 'positivo'"
                    :class="rhFactor === 'positivo'
                        ? 'bg-accent text-primaryDark'
                        : 'bg-primary text-textLight'"
                    class="rounded-full px-3 py-1 text-xs"
                >
                    Positivo (+)
                </button>

                <button
                    type="button"
                    @click="rhFactor = 'negativo'"
                    :class="rhFactor === 'negativo'
                        ? 'bg-accent text-primaryDark'
                        : 'bg-primary text-textLight'"
                    class="rounded-full px-3 py-1 text-xs"
                >
                    Negativo (-)
                </button>
            </div>
        </div>

        <!-- altrgias -->
		<section class="flex flex-col gap-1">
			<p class="text-base">Alergias:</p>

			<div class="max-h-22 overflow-y-auto flex flex-col gap-1 pr-1 scrollbar-hide">
				<div
					v-for="(allergy, index) in allergies"
					:key="index"
					class="flex items-center gap-2"
				>
					<input
						v-model="allergies[index]"
						type="text"
						:aria-label="`Alergia ${index + 1}`"
						placeholder="Digite uma alergia"
						class="min-w-0 flex-1 rounded-sm bg-surface px-2 py-2 text-xs text-textDark outline-none focus:ring-1 focus:ring-accent"
					/>

					<button
						type="button"
						@click="removeAllergy(index)"
						aria-label="Remover alergia"
						class="material-symbols-rounded text-base"
					>
						delete
					</button>

					<span
						class="material-symbols-rounded text-base"
						aria-hidden="true"
					>
						drag_handle
					</span>
				</div>
			</div>

			<button
				type="button"
				@click="addAllergy"
				class="flex items-center gap-1 self-start text-xs text-accent"
			>
				<span class="material-symbols-rounded text-base">add</span>
				Adicionar item
			</button>
		</section>

        <!-- altura -->
        <label class="flex flex-col gap-1">
            <span>Altura:</span>

            <BaseInput
                type="text"
                theme="light"
                icon="height"
                placeholder="Ex.: 1,75 metros"
                v-model="height"
                required
            />
        </label>

        <!-- peso -->
        <label class="flex flex-col gap-1">
            <span>Peso</span>

            <BaseInput
                type="text"
                theme="light"
                icon="monitor_weight"
                placeholder="Ex.: 81 Kg"
                v-model="weight"
                required
            />
        </label>

        <!-- Salvar -->
        <BaseButton
            type="submit"
            theme="accent"
        >
            Salvar
        </BaseButton>
    </form>
</template>
