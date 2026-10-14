<script setup lang="ts">
import NavBar from "@/components/NavBar.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import { useAuthStore } from "@/stores/authStore"
import PermissionCard from "@/components/cards/PermissionCard.vue"
import { ref } from "vue"
import Professional from "@/database/professional.model"
import { Timestamp } from "firebase/firestore"
import BaseButton from "@/components/bases/BaseButton.vue"
import BaseDialog from "@/components/bases/BaseDialog.vue"
import FormAddProfessional from "@/components/forms/FormAddProfessional.vue"
import { useTemplateRef } from "vue"

const authStore = useAuthStore()
const addProfessionalDialog = useTemplateRef("addProfessionalDialog")

const profissionais = ref([
	new Professional("1", "profissional@email.coma", "Cláudia Silva", "12121212121", "12312312312", "professional", { crm: "123123", uf: "ES", operation_area: "Meridional"}, Timestamp.now()),
	new Professional("2", "profissional@email.coma", "Cláudia Silva", "12121212121", "12312312312", "professional", { crm: "123123", uf: "ES", operation_area: "Meridional"}, Timestamp.now()),
	new Professional("3", "profissional@email.coma", "Cláudia Silva", "12121212121", "12312312312", "professional", { crm: "123123", uf: "ES", operation_area: "Meridional"}, Timestamp.now()),
])


authStore.onReady(async () => {
	// get professionals
})
</script>

<template>
	<div class="flex h-screen">
		<NavBar />

		<main class="w-full h-full overflow-hidden px-6 py-8 flex flex-col gap-4">
			<header class="flex flex-col gap-8">
				<h1 class="text-4xl text-textLight font-bold text-center lg:text-start">
					Permissões médicas
				</h1>

				<section class="flex flex-row justify-center gap-2 *:h-[stretch]">
					<BaseButton
						type="button"
						theme="accent"
						icon="person_add"
						class="rounded-2xl gap-2"
						@click="addProfessionalDialog?.show()"
					>
						<span class="hidden lg:block">Adicionar profissional</span>
					</BaseButton>

					<BaseInput
						placeholder="Pesquisar"
						icon="search"
						class="place-self-center w-full md:w-120"
					/>
				</section>
			</header>

			<section class="flex flex-col items-center gap-4 flex-1 min-h-0 overflow-y-auto scrollbar-hide">
				<!-- <article class="w-full flex justify-center">
					<section
						class="relative flex w-[85%] md:w-[70%] lg:w-[45%] min-h-11 items-center border border-textLight text-sm text-textLight rounded-[15px]"
					>
						<span class="material-symbols-rounded pointer-events-none absolute left-3">
							shield
						</span>

						<div class="w-full text-center text-sm lg:text-[13px]">
							<p>
								Controle quais profissionais da saúde podem acessar seu histórico.
							</p>
						</div>
					</section>
				</article> -->
				
				<div class="w-full grid gap-4 grid-cols-[repeat(auto-fit,minmax(20em,1fr))]">
					<PermissionCard
						v-for="profissional in profissionais"
						:key="profissional.id"
						:professional="profissional"
					/>
				</div>
			</section>
		</main>

		<BaseDialog title="Adicionar profissional" ref="addProfessionalDialog">
			<FormAddProfessional @handled-submit="addProfessionalDialog?.hide()" />
		</BaseDialog>
	</div>
</template>
