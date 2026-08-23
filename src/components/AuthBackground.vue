<template>
	<div
		class="w-screen min-h-screen bg-[url(/img/BackgroundImg.jpg)] bg-cover bg-center bg-no-repeat"
	>
		<div
			class="absolute inset-0 bg-linear-to-r from-transparent from-30% to-background to-55% flex flex-row"
		>
			<slot></slot>
		</div>
	</div>
</template>
