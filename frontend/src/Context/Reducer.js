export const intialState = {
    user: {},
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD_USER':
            return {
                ...state,
                user: action.item,
            }

        default: return state
    }
}

export default reducer;