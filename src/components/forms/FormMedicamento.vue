<script setup lang="ts">
import BaseInput from "@/components/bases/BaseInput.vue"
import BaseButton from "@/components/bases/BaseButton.vue"
import BaseSelect from "@/components/bases/BaseSelect.vue"

const props = defineProps<{
    prescricaoId?: string
}>()

const pacientes = [
    { id: '1', nome: 'Cláudio Silva' },
    { id: '2', nome: 'Joana Neto' },
    { id: '3', nome: 'Marcos Oliveira' },
    { id: '4', nome: 'Fernanda Souza' },
    { id: '5', nome: 'Rafael Almeida' },
    { id: '6', nome: 'Patrícia Lima' },
]

const vias = ['Oral', 'Tópico', 'Injetável', 'Inalatório', 'Sublingual']


</script>

<template>
    <form @submit.prevent="registrarPrescricao" class="flex flex-col gap-4 z-48">
        <label>
            <p>Para qual paciente?</p>

            <BaseSelect
                icon="person"
                theme="light"
                defaultValue="Paciente"
                required
            >
                <template v-for="paciente in pacientes" :key="paciente.id">
                    <option :value="paciente.id">{{ paciente.nome }}</option>
                </template>
            </BaseSelect>
        </label>

        <label>
            <p>Qual medicamento?</p>
            <BaseInput
                type="text"
                placeholder="Nome do medicamento"
                theme="light"
                required
            />
        </label>

        <label>
            <p>Qual a via de consumo?</p>

            <BaseSelect
                icon="medication"
                theme="light"
                defaultValue="Via de consumo"
                required
            >
                <template v-for="via in vias" :key="via">
                    <option :value="via">Consumo {{ via }}</option>
                </template>
            </BaseSelect>
        </label>

        <label>
            <p>Qual a dosagem?</p>
            <BaseInput
                type="text"
                placeholder="Ex: 500mg"
                theme="light"
                required
            />
        </label>

        <label>
            <p>De quanto em quanto tempo?</p>
            <div class="flex flex-row items-center gap-4 text-textLight w-full">
                A cada
                <BaseInput
                    type="number"
                    min="1"
                    max="72"
                    theme="light"
                    class="grow"
                    required
                />
                horas
            </div>
        </label>

        <div>
            <p>Durante qual período?</p>
            <fieldset class="flex gap-4 w-full">
                <label class="grow">
                    <span class="text-sm">Início</span>
                    <BaseInput
                        type="date"
                        theme="light"
                        required
                    />
                </label>

                <label class="grow">
                    <span class="text-sm">Fim</span>
                    <BaseInput
                        type="date"
                        theme="light"
                        required
                    />
                </label>
            </fieldset>
        </div>

        <label>
            <p>Observações</p>
            <BaseInput
                name="observacoes"
                placeholder="Orientações adicionais, como tomar após as refeições"
                bgColor="textLight"
                textColor="primaryDark"
            />
        </label>

        <BaseButton type="submit" theme="accent" class="m-auto px-10">
            {{ prescricaoId ? "Atualizar Prescrição" : "Prescrever Medicamento" }}
        </BaseButton>
    </form>
</template>
