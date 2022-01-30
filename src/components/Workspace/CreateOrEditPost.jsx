import React from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import {addNewPost, editPost} from "../../redux/userReducer";


function CreateOrEditPost() {
    const [values, setValues] = React.useState({
        title: '',
        text: '',
        file: null,
        desc: '',
    })
    const params = useParams()
    const navigate = useNavigate();
    const post = useSelector(state => state.user.posts.filter(el => el._id === params.id))
    const dispatch = useDispatch()


    React.useEffect(() => {
        if (params.id) {
            setValues({
                title: post[0].title,
                text: post[0].text,
                desc: post[0].description,
                file: null,
            })
        }
    }, [])

    const onKeyDown = (e) => {
        if (e.keyCode === 13 && e.target.name === 'title') {
            setValues(prevState => {
                return {
                    ...prevState,
                    title: values.title + '\n',
                }
            })
        }

        if (e.keyCode === 13 && e.target.name === 'text') {
            setValues(prevState => {
                return {
                    ...prevState,
                    text: values.text + '\n',
                }
            })
        }
    }

    const onChange = (e) => {
        if (e.target.name === 'title') {
            setValues(prevState => {
                return {
                    ...prevState,
                    title: e.target.value,
                }
            })
        }

        if (e.target.name === 'text') {
            setValues(prevState => {
                return {
                    ...prevState,
                    text: e.target.value,
                }
            })
        }

        if (e.target.name === 'file') {
            setValues(prevState => {
                return {
                    ...prevState,
                    file: e.target.files[0],
                }
            })
        }

        if (e.target.name === 'desc') {
            setValues(prevState => {
                return {
                    ...prevState,
                    desc: e.target.value,
                }
            })
        }

    }

    console.log(values)
    const onSubmit = (e) => {
        e.preventDefault()
        if (params.id) {
            console.log(values)
            dispatch(editPost(values,params.id))
            navigate("/workspace");
        } else {
            console.log(values)
            dispatch(addNewPost(values))
            navigate("/workspace");
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <label>Заголовок
                <textarea onKeyDown={onKeyDown} onChange={onChange} value={values.title}
                          className='workspace_create-title' name="title"
                          placeholder='Введите заголовок'>
            </textarea>
            </label>
            <label>Описание
                <textarea onKeyDown={onKeyDown} onChange={onChange} value={values.desc}
                          className='workspace_create-title' name="desc"
                          placeholder='Введите описание статьи'>
            </textarea>
            </label>
            <input type="file" onChange={onChange} name='file'/>
            <label>
                Текст статьи
                <textarea onKeyDown={onKeyDown} onChange={onChange} className='workspace_create-text' name="text"
                          value={values.text}
                          placeholder='Введите текст статьи'>
            </textarea>
            </label>
            <button className='btn' type='submit'>Отправить</button>
        </form>
    )
}

export default CreateOrEditPost