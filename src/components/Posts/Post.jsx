import React, {useRef, useState} from "react";
import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {addComment, deleteUserComment, editUserComment, getPost} from "../../redux/postsReducer";
import {Link} from "react-router-dom";
import {getDate} from "../../tools";
import Avatar from "@mui/material/Avatar";
import style from './post.module.css'
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

function Post() {
    const params = useParams();
    const dispatch = useDispatch()
    const {title, user, text, createdAt, _id, views, description, photoUrl} = useSelector(state => state.posts.post)
    const comments = useSelector(state => state.posts.comments)
    const userData = useSelector(state => state.auth)
    const date = new Date(createdAt).toLocaleDateString()
    const handleText = text.split('\n')
    console.log(handleText)
    React.useEffect(() => {
        dispatch(getPost(params.id))
    }, [])

    return (
        <div>
            <div className={style.post}>
                <img className='post_img' src={'http://localhost:5656/'+ photoUrl} alt={title}/>
                <div>
                    <h2 className='post_title'>{title}</h2>
                    <Link to={`/user/${user._id}`}>
                        <h3 className={style.post_name}>Автор {user.fullName}</h3>
                    </Link>
                    <div className={style.post_info}>
                        <time>{date}</time>
                        <div className='views'>
                            <span className='views_count'>{views}</span>
                            <RemoveRedEyeIcon/>
                        </div>
                    </div>
                    <div className={style.post__description}>{description}</div>
                    <div className={style.post__text}>{handleText.map(el => el ? <p>{el}</p> : <br/>)}</div>
                    <ul className={style.post_comments}>
                        {comments.map(el => <Comment key={el._id} text={el.text} createdAt={el.createdAt}
                                                     fullName={el.user.fullName} userId={el.user._id} commentId={el._id}
                                                     postId={params.id}/>)}
                    </ul>
                    {userData.userAuth ?
                        <AddComment postId={_id} text={''} fullName={userData.fullName} userId={userData.id}/> :
                        <Message/>}
                </div>
            </div>
        </div>
    )
}


function Comment({text, createdAt, fullName, userId, commentId, postId}) {
    const [editMode, setEditMode] = React.useState(false)
    const dispatch = useDispatch()
    const avatar = fullName.split('').slice(0, 1).join('')
    const date = new Date(createdAt).toLocaleDateString()
    const icons = useRef()

    const deleteComment = () => {
        dispatch(deleteUserComment(commentId, postId))
    }
    const editComment = () => {
        setEditMode(true)
    }

    const changeOpacity = (e) => {

        if (userId === localStorage.getItem('id') && e._reactName === 'onMouseOver') {
            icons.current.style.opacity = '1'
        }

        if (userId === localStorage.getItem('id') && e._reactName === 'onMouseOut') {
            icons.current.style.opacity = '0'
        }
    }

    if (editMode) {
        return (
            <AddComment postId={postId} text={text} setEditMode={setEditMode} commentId={commentId} fullName={fullName}
                        userId={userId}/>
        )
    }

    return (
        <li className={style.comment} onMouseOver={changeOpacity} onMouseOut={changeOpacity}>
            <Link to={`/user/${userId}`} className={style.comment_link}>
                <Avatar className={style.comment_avatar} style={{
                    backgroundColor: '#2f49ff'
                }}>{avatar}</Avatar>
                <h3>{fullName}</h3>
            </Link>
            <div className={style.comment_inner}>
                <p className={style.comment_text}>{text}</p>
                <time className={style.comment_time}>{date}</time>
            </div>

            {userId === localStorage.getItem('id') && <div className={style.comment_icons} ref={icons}>
                <ClearIcon onClick={deleteComment}/>
                <EditIcon className={style.comment_edit} onClick={editComment}/>
            </div>}
        </li>
    )
}

function AddComment({postId, text, setEditMode, commentId, userId, fullName}) {
    const [textarea, setTextarea] = useState(text)
    const dispatch = useDispatch()
    const avatar = fullName.split('').slice(0, 1).join('')

    const onInputChange = (e) => {
        setTextarea(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (text) {
            dispatch(editUserComment(textarea, commentId, postId))
            setEditMode(false)
        } else {
            dispatch(addComment(textarea, postId))
            setTextarea('')
        }
    }

    return (
        <div className={style.form}>
            <Link to={`/user/${userId}`} className={style.comment_link}>
                <Avatar className={style.comment_avatar} style={{
                    backgroundColor: '#2f49ff'
                }}>{avatar}</Avatar>
                <h3>{fullName}</h3>
            </Link>
            <form onSubmit={onSubmit} className={style.form_inner}>
            <textarea className={style.form_textarea} value={textarea} onChange={onInputChange} name="comment">
            </textarea>
                {text ? <button className='btn' type='submit'>сохранить</button> :
                    <button className='btn' type='submit'>отправить</button>}
            </form>
        </div>
    )
}

function Message() {
    return (
        <div>have to login</div>
    )
}

export default Post