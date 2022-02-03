import React from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import {addNewPost, editPost} from "../../redux/userReducer";
import {postsAPI} from "../../api";
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';

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
                photoUrl: post[0].photoUrl,
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

    const onChange = async (e) => {
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
            const formData = new FormData()
            formData.append('file', e.target.files[0])

            const img = await postsAPI.addPostImg(formData)

            setValues(prevState => {
                return {
                    ...prevState,
                    photoUrl: img.url,
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

    const onSubmit = (e) => {
        e.preventDefault()
        if (params.id) {
            dispatch(editPost(values, params.id))
            navigate("/workspace");
        } else {
            dispatch(addNewPost(values))
            navigate("/workspace");
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <div className='workspace__inner'>
                <div>
                    <label>Заголовок
                        <textarea onKeyDown={onKeyDown} onChange={onChange} value={values.title}
                                  className='workspace_create-title' name="title"
                                  placeholder='Введите заголовок'>
            </textarea>
                    </label>
                    <label>Описание
                        <textarea onKeyDown={onKeyDown} onChange={onChange} value={values.desc}
                                  className='workspace_create-desc' name="desc"
                                  placeholder='Введите описание статьи'>
            </textarea>
                    </label>
                    <label>
                        Текст статьи
                        <textarea onKeyDown={onKeyDown} onChange={onChange} className='workspace_create-text'
                                  name="text"
                                  value={values.text}
                                  placeholder='Введите текст статьи'>
            </textarea>
                    </label>
                </div>
                 <div className='workspace__files'>
                     {values.photoUrl ? <img className='workspace__img' src={values.photoUrl}
                                             alt={values.title}/>: <div className='workspace__block'></div>}
                    <label>
                        <input className='workspace__file' type="file" onChange={onChange} name='file'/>
                        <div className='workspace__upload'>
                            <span>Загрузить фото</span>
                            <div className='workspace__icon'>
                                <UploadFileOutlinedIcon sx={{ fontSize: 45 }}/>
                            </div>
                        </div>
                    </label>
                </div>
            </div>
            <button className='btn' type='submit'>Отправить</button>
        </form>
    )
}

export default CreateOrEditPost