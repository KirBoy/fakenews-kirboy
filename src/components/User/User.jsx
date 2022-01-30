import React from "react";
import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {getUserProfile} from "../../redux/userReducer";
import {Link} from "react-router-dom";
import {getDate} from "../../tools";
import './user.css'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

function User() {
    const params = useParams();
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const date = new Date(user.createdAt).toLocaleDateString()
    console.log(user.fullName)
    React.useEffect(() => {
        dispatch(getUserProfile(params.id))
    }, [user.fullName])

    return (
        <div className='user'>
            <div className='user_left'>
                <img className='user_ava' src="../../assets/ava.PNG" alt=""/>
                <h1 className='user_name'>{user.fullName}</h1>
                <time>с нами с {date}</time>
            </div>
            <div className='user_right'>
                <h2 className='user_subtitle'>Посты</h2>
                <ul className='user_list'>
                    {user.posts.map(el => <PreviewPost key={el._id} title={el.title} createdAt={el.createdAt}
                                                       views={el.views}
                                                       id={el._id}/>)}
                </ul>
                {/*<ul>*/}
                {/*    {user.comments.map(el => <Comment key={el._id} text={el.text} createdAt={el.createdAt}*/}
                {/*                                      post={el.post}/>)}*/}
                {/*</ul>*/}
            </div>
        </div>
    )
}

export default User


function PreviewPost({title, createdAt, views, id}) {
    const date = new Date(createdAt).toLocaleDateString()
    return (
        <li className='user_post'>
            <Link to={`/posts/${id}`} className='user_link'>
                <h3 className='user_post-title'>{title}</h3>
                <div>
                    <div className='views'>
                        <span className='views_count'>{views} </span>
                        <RemoveRedEyeIcon/>
                    </div>
                    <time>{date}</time>
                </div>
            </Link>
        </li>
    )
}

function Comment({text, createdAt, post}) {
    const date = getDate(createdAt)
    return (
        <li>
            <Link to={`/posts/${post}`}>
                <p>{text}</p>
                <time>{date}</time>
            </Link>
        </li>
    )
}