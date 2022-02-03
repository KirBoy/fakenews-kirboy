import {applyMiddleware, combineReducers, createStore} from "redux";
import authReducer from "./authReducer";
import thunk from "redux-thunk";
import postsReducer from "./postsReducer";
import userReducer from "./userReducer";
import { composeWithDevTools } from 'redux-devtools-extension';

const reducers = combineReducers({
    auth: authReducer,
    posts:postsReducer,
    user:userReducer,
})


const store = createStore(
    reducers,
    composeWithDevTools(
        applyMiddleware(thunk)
    )
);
window.store = store;
export default store;