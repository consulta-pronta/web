import { defineStore } from "pinia"
import { ref, watch } from "vue"

export type FontSize = "default" | "big" | "small"
export type ContrastLevel = "default" | "high" | "high++"

export const useConfigStore = defineStore("config", () => {
	const fontSize = ref<FontSize>("default")
	const lightTheme = ref(false)
	const contrastLevel = ref<ContrastLevel>("default")
	const boldText = ref(false)
	const reduceAnimations = ref(false)

	const getClassList = () => document.documentElement.classList

	const applyClass = (name: string, status = true) =>
		getClassList().toggle(name, status)

	watch(fontSize, (size) => {
		getClassList().remove("fontSmall", "fontBig")

		if (size != "default") {
			applyClass(size === "big" ? "fontBig" : "fontSmall", true)
		}
	})
	watch(lightTheme, (enabled) => applyClass("lightTheme", enabled))
	watch(contrastLevel, (level) => {
		getClassList().remove("highContrast", "highContrastPlusPlus")

		if (level != "default") {
			applyClass("highContrast")
			if (level === "high++") applyClass("highContrastPlusPlus")
		}
	})
	watch(boldText, (enabled) => applyClass("boldText", enabled))
	watch(reduceAnimations, (enabled) => applyClass("reducedAnimations", enabled))

	return {
		fontSize,
		lightTheme,
		contrastLevel,
		boldText,
		reduceAnimations,
	}
})