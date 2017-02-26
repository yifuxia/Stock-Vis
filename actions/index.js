export const change_stock = (stock_name) => {
	return {
		type: 'STOCK_CHANGED',
		val: stock_name
	}
}

export const change_element_display = (el) => {
	return {
		type: 'DISPLAY_CHANGED',
		val: el
	}
}