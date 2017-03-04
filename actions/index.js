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

var nextCmpStock=0;
export const add_cmp_stock = () => {
	return {
		type: 'ADD_CMP_STOCK',
		id: nextCmpStock++,
		name: 'AAPL'
	}
}

export const change_cmp_stock = (obj) => {
	return {
		type: 'CHANGE_CMP_STOCK',
		val: obj.name,
		id: obj.id
	}
}

export const delete_cmp_stock = (id) => {
	return {
		type: 'DELETE_CMP_STOCK',
		id: id
	}
}
