<template>
	<div
		class="w-screen min-h-screen bg-[url(/img/BackgroundImg.jpg)] bg-cover bg-center bg-no-repeat"
	>
		<div
			class="absolute inset-0 bg-linear-to-r from-transparent from-0% lg:from-25% to-background to-0% lg:to-50% flex flex-col lg:flex-row"
		>
			<slot></slot>
		</div>
	</div>
</template>
