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

export const change_time_range = (range) => {
	return {
		type: 'TIME_CHANGED',
		val: range
	}
}
