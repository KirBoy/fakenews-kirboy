import './App.css';
import React from "react";
import {
    Routes,
    Route, Link
} from "react-router-dom";
import RegisterOrAuth from './components/Regist+Auth/RegisterOrAuth'
import {useDispatch, useSelector} from "react-redux";
import PostsFeed from "./components/Posts/PostsFeed";
import Post from "./components/Posts/Post";
import User from "./components/User/User";
import {getUserAuthProfile, userLogOut} from "./redux/authReducer";
import ProfileIcon from "./components/Icons/ProfileIcon";
import WorkSpace from "./components/Workspace/WorkSpace";
import CreatePostLink from "./components/Icons/EditPostsIcon";
import PrivateRoute from "./components/PrivatHOC";
import CreateOrEditPost from "./components/Workspace/CreateOrEditPost";
import SearchForm from "./components/SearchForm";
import LogoutIcon from "./components/Icons/LogoutIcon";
import {addNewPosts, getPosts} from "./redux/postsReducer";

function App() {

    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth.userAuth)
    const filter = useSelector(state => state.posts.filter)
    const query = useSelector(state => state.posts.query)
    const currentPage = useSelector(state => state.posts.currentPage)
    const totalPages = useSelector(state => state.posts.pages)
    const isLoading = useSelector(state => state.posts.isLoading)


    React.useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(getUserAuthProfile(localStorage.getItem('id')))
        }

    }, [])

    React.useEffect(() => {
        window.scrollTo(0, 0)
        dispatch(getPosts())
    }, [query, filter])

    const checkPosition = () => {
        console.log(1)
        const height = document.body.offsetHeight
        const screenHeight = window.innerHeight
        const scrolled = window.scrollY
        const threshold = height - screenHeight / 2
        const position = scrolled + screenHeight

        if (position >= threshold && totalPages !== currentPage) {
            dispatch(addNewPosts())
        }
    }

    if (!isLoading && totalPages !== currentPage && window.location.pathname === '/') {
        window.onscroll = checkPosition
    }


    return (
        <>
            <header className='header'>
                <div className="header_left">
                    <Link to="/">
                        <img className='logo' src="/assets/logo.svg" alt=""/>
                    </Link>

                    <SearchForm/>

                </div>
                <div className='header_icons'>
                    {auth ? <ProfileIcon/> : <RegisterOrAuth/>}
                    {auth && <CreatePostLink/>}
                    {auth && <LogoutIcon/>}
                </div>
            </header>
            <div className='container'>
                <Routes>
                    <Route path="/" element={<PostsFeed/>}/>
                    <Route path="posts/:id" element={<Post/>}/>
                    <Route path='user/:id' element={<User/>}/>
                    <Route path='workspace/edit/:id' element={<PrivateRoute><CreateOrEditPost/></PrivateRoute>}/>
                    <Route path='workspace/create' element={<PrivateRoute><CreateOrEditPost/></PrivateRoute>}/>
                    <Route path='workspace' element={<PrivateRoute><WorkSpace/></PrivateRoute>}/>
                    <Route
                        path="*"
                        element={
                            <main style={{padding: "1rem"}}>
                                <p>There's nothing here!</p>
                            </main>
                        }
                    >
                    </Route>
                </Routes>
            </div>
        </>
    )

}

export default App;
