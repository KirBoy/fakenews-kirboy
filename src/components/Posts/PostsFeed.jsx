import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {getPosts} from "../../redux/postsReducer";
import './postsFeed.css'
import {Link} from "react-router-dom";

function PostsFeed() {
    const dispatch = useDispatch()
    const posts = useSelector(state => state.posts.posts)
    const query = useSelector(state => state.posts.query)
    console.log(posts)
    React.useEffect(() => {
        dispatch(getPosts(query))
    }, [query])

    if (posts.length === 0) {
        return (<div>По запросу {query} ничего не найдено</div>)
    }

    return (
        <ul className='posts'>
            {posts && posts.map(el => <PostMini key={el._id} title={el.title} user={el.user.fullName}
                                                date={el.createdAt} id={el._id} views={el.views} img={el.photoUrl} description={el.description}/>)}
        </ul>
    )
}

export default PostsFeed


function PostMini({title, user, date, id, description, img}) {
    const fixedDate = new Date(date).toLocaleDateString()
    return (
        <li className='post'>
            <Link to={`/posts/${id}`}>
                <img className='post_img' src={img} alt={title}/>
                <h2 className='post_title'>{title}</h2>
                <h3 className='post_author'>Автор {user}</h3>
                <time className='post_time'>{fixedDate}</time>
                <p className='post_text'>{description}</p>
            </Link>
        </li>
    )
}