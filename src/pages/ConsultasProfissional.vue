<script setup lang="ts">
import { ref } from "vue"
import NavBar from "@/components/NavBar.vue"
import FilterOrd from "@/components/FilterOrd.vue";

</script>

<template>
	<div class="flex h-screen">
		<NavBar />

		<main class="w-full h-full overflow-y-auto px-6 py-8">
			<header class="mb-8 flex flex-col gap-8">
				<h1 class="text-4xl text-textLight font-bold text-center lg:text-start">
					Consultas
				</h1>
			</header>

			<article>
				<section class="grid grid-cols-1 gap-4">
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
						<div class="border border-textLight rounded-xl p-6">
							<p class="text-base text-textLight font-bold text-start">
								Próxima Consulta
							</p>
						</div>
						<div class="border border-textLight rounded-xl p-6">
							<!-- div 2 -->
						</div>
					</div>

					<div class="border border-textLight rounded-xl p-6">
						<div class="flex justify-between">
							<p class="text-base text-textLight font-bold text-start">
								Consultas
							</p>
							<FilterOrd :filter="false"/>
						</div>

					</div>
				</section>
			</article>
		</main>
	</div>
</template>
