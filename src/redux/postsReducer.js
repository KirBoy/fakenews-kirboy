import {postsAPI} from "../api";
import {userLogOut} from "./authReducer";

const SET_POSTS = 'SET_POSTS'
const SET_POST = 'SET_POST';
const SET_COMMENTS = 'SET_COMMENTS';
const SET_IS_LOADING = 'SET_IS_LOADING';
const ADD_NEW_POSTS = 'ADD_NEW_POSTS';
const SET_QUERY = 'SET_QUERY';

const initialState = {
    posts: [],
    pages: 0,
    post: {title: null, user: {fullName: null}, text: '', createdAt: '', id: null, views:0},
    comments: [],
    currentPage: 1,
    isLoading: false,
    query: ''
}


const postReducer = (state = initialState, action) => {

    switch (action.type) {

        case SET_POSTS:
            return {
                ...state, posts: action.posts, pages: Math.ceil(action.total / 5)
            }

        case SET_POST:
            return {
                ...state, post: action.post
            }

        case SET_COMMENTS:
            return {
                ...state, comments: action.comments
            }

        case SET_IS_LOADING:
            return {
                ...state, isLoading: true
            }

        case ADD_NEW_POSTS:
            return {
                ...state, posts: [...state.posts, ...action.posts], currentPage: state.currentPage + 1, isLoading: false
            }

        case SET_QUERY:
            return {
                ...state, query: action.query
            }

        default :
            return state
    }

}


export const setPosts = (posts, total) => {
    return {
        type: SET_POSTS,
        posts,
        total
    }
}

export const setIsLoading = () => {
    return {
        type: SET_IS_LOADING,
    }
}

const setOnePostContent = (post) => {
    return {
        type: SET_POST,
        post
    }
}

const addNewPosts = (posts) => {
    return {
        type: ADD_NEW_POSTS,
        posts
    }
}

export const setQuery = (query) => {
    return {
        type: SET_QUERY,
        query
    }
}


const setComments = (comments) => {
    return {
        type: SET_COMMENTS,
        comments
    }
}


function setPost(post, comments) {
    return dispatch => {
        dispatch(setOnePostContent(post))
        dispatch(setComments(comments))
    }
}


export const getPosts = (query) => async (dispatch) => {
    let response = await postsAPI.posts(query)
    if (response) {
        dispatch(setPosts(response.items, response.total))
    }
}

export const getPost = (id) => async (dispatch) => {
    let response = await postsAPI.post(id)
    let responseComments = await postsAPI.comments(id)
    if (response) {
        console.log(response)
        dispatch(setPost(response, responseComments))
    }
}

export const addComment = (text, id) => async (dispatch) => {
    let response = await postsAPI.addComment(text, id)
    let responseComments = await postsAPI.comments(id)
    if (response) {
        dispatch(setComments(responseComments))
    }
}

export const editUserComment = (text, id, postId) => async (dispatch) => {
    let response = await postsAPI.editComment(text, id)
    let responseComments = await postsAPI.comments(postId)
    if (response) {
        dispatch(setComments(responseComments))
    }
}

export const deleteUserComment = (id, postId) => async (dispatch) => {
    await postsAPI.delComment(id)
    let responseComments = await postsAPI.comments(postId)
    dispatch(setComments(responseComments))
}

export const getMorePosts = (page) => async (dispatch) => {
    let response = await postsAPI.getMorePosts(page)
    dispatch(addNewPosts(response.items))
}

// export const searchPosts = (query) => async (dispatch) => {
//     let response = await postsAPI.searchPosts(query)
//     dispatch(foundPosts(response.items, response.total, query))
// }


export default postReducer