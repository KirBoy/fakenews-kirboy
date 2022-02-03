import {postsAPI, profileAPI} from "../api";

const SET_USER_PROFILE = 'SET_USER_PROFILE'
const DELETE_POST = 'DELETE_POST'
const PATCH_POST = 'PATCH_POST'
const ADD_POST = 'ADD_POST'


const initialState = {
    fullName: null,
    createdAt: '',
    comments: [],
    posts: [],
}


const userReducer = (state = initialState, action) => {

    switch (action.type) {

        case SET_USER_PROFILE:
            return {
                fullName: action.fullName, createdAt: action.createdAt, comments: action.comments, posts: action.posts
            }


        case DELETE_POST:
            return {
                ...state, posts: state.posts.filter(el => el._id !== action.id)
            }

        case PATCH_POST:
            return {
                ...state, posts: state.posts.map(el => {
                    if (el._id === action.id) {
                        return {
                            ...el, title: action.title, text: action.text
                        }
                    } else {
                        return el
                    }
                })
            }

        case ADD_POST:
            return {
                ...state, posts: [...state.posts, action.post]
            }

        default :
            return state
    }

}

const setUserProfile = ({createdAt, fullName, comments, posts}) => {
    return {
        type: SET_USER_PROFILE,
        createdAt,
        fullName,
        comments,
        posts
    }
}


const deletePost = (id) => {
    return {
        type: DELETE_POST,
        id
    }
}

const patchPost = (title, text, id) => {
    return {
        type: PATCH_POST,
        title, text, id
    }
}

const addPost = (post) => {
    return {
        type: ADD_POST,
        post
    }
}


export const getUserProfile = (id) => async (dispatch) => {
    try {
        let response = await profileAPI.profile(id)
        dispatch(setUserProfile(response))
    } catch (e) {

    }
}

export const addNewPost = ({title, text, photoUrl, desc}) => async (dispatch) => {
    const response = await postsAPI.addPost(title, text, photoUrl, desc)
    dispatch(addPost(response))
}

export const deleteUserPost = (id) => async (dispatch) => {
    await postsAPI.delPost(id)
    dispatch(deletePost(id))
}

export const editPost = ({title, text, photoUrl, desc}, id) => async (dispatch) => {

    await postsAPI.editPost(title, text, photoUrl, desc, id)
    dispatch(patchPost(title, text, id))
}


export default userReducer