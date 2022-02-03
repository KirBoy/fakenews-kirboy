import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {getDate} from "../../tools";
import {Link} from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {deleteUserPost, getUserProfile} from "../../redux/userReducer";
import './workspace.css'

function WorkSpace() {
    const posts = useSelector(state => state.user.posts)
    const id = useSelector(state => state.auth.id)
    const dispatch = useDispatch()

    React.useEffect(() => {
        dispatch(getUserProfile(id))
    }, [id])

    return (
            <div className='workspace'>
                {posts.length ? <ul className='workspace_list'>
                    {posts.map(el => <PreviewPost key={el._id} title={el.title} createdAt={el.createdAt}
                                                  views={el.views}
                                                  id={el._id}/>)}
                </ul> : <p className='workspace__desc'>У вас пока нету записей для редактирования.</p>}
                <Link to={`/workspace/create`}>
                    <button className='btn btn--big'>Создать новую запись</button>
                </Link>
            </div>
    )
}


function PreviewPost({title, createdAt, views, id}) {
    const date = new Date(createdAt).toLocaleDateString()
    const dispatch = useDispatch()
    const deletePost = () => {
        dispatch(deleteUserPost(id))
    }
    return (
        <li className='workspace_item'>
            <div className='workspace_top' >
                <h3 className='workspace_title'>{title}</h3>
                <div>
                    <Link to={`/workspace/edit/${id}`} style={{
                        marginRight:'15px'
                    }}>
                        <button className='btn'>Редактировать</button>
                    </Link>
                    <button className='btn' onClick={deletePost}>Удалить</button>
                </div>
            </div>
            <div className='workspace_bottom'>
                <div className='views'>
                    <span className='views_count'>{views} </span>
                    <RemoveRedEyeIcon/>
                </div>
                <time>Дата создания поста {date}</time>
            </div>
        </li>
    )
}

export default WorkSpace