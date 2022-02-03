import {authAPI, profileAPI} from "../api";

const SET_USER = 'SET_USER'
const SET_MODAL = 'SET_MODAL'
const CHECK_USER = 'CHECK_USER'
const USER_LOGOUT = 'USER_LOGOUT'


const initialState = {
    fullName: null,
    modalOpen: false,
    userAuth: false,
    id: null
}


const authReducer = (state = initialState, action) => {

    switch (action.type) {

        case CHECK_USER:
            return {
                ...state, userAuth: true, fullName: action.fullName, id: action.id
            }

        case SET_USER:
            return {
                ...state, fullName: action.fullName, userAuth: true, id: action.id
            }

        case SET_MODAL: {
            return {
                ...state, modalOpen: !state.modalOpen
            }
        }

        case USER_LOGOUT: {
            return {
                ...state, fullName: null, userAuth: false
            }
        }

        default :
            return state
    }

}


export const setOpenModal = () => {
    return {
        type: SET_MODAL
    }
}

export const setUser = (fullName, id) => {
    return {
        type: SET_USER,
        fullName,
        id
    }
}

export const isUserAuth = (fullName, id) => {
    return {
        type: CHECK_USER,
        fullName,
        id
    }
}

export const userLogOut = () => {
    return {
        type: USER_LOGOUT
    }
}


export function setUserProfile(fullName, id) {
    return dispatch => {
        dispatch(setOpenModal())
        dispatch(setUser(fullName, id))
    }
}

// export const getRegisterUser = ({fullName, email, password}) => async (dispatch) => {
//     try {
//         let response = await authAPI.register(fullName, email, password)
//         localStorage.setItem('token', response.token);
//         localStorage.setItem('id', response._id);
//         dispatch(setUserProfile(fullName, response._id))
//     } catch (e) {
//
//     }
// }

export const getAuthUser = ({email, password}) => async (dispatch) => {
    let response = await authAPI.login(email, password)
    localStorage.setItem('token', response.token);
    localStorage.setItem('id', response._id);
    dispatch(setUserProfile(response.fullName, response._id))
}

export const getUserAuthProfile = (id) => async (dispatch) => {
    let response = await profileAPI.profile(id)
    dispatch(isUserAuth(response.fullName, response._id))
}


export default authReducer