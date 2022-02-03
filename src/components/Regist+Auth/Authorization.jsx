import React from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import * as yup from "yup";
import {getAuthUser, setUserProfile} from "../../redux/authReducer";
import {useDispatch} from "react-redux";
import {authAPI, getCurrentAxiosInstance} from "../../api";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '1px solid #2f49ff',
    boxShadow: 24,
    p: 4,
};

const schema = yup.object({
    email: yup.string().email('Некорректный email').required('Обязательно к заполнению'),
    password: yup.string().required('Обязательно к заполнению').min(6, 'Пароль должен быть более 6 символов'),
}).required();

function Authorization({setTab}) {
    const dispatch = useDispatch()
    const {register, handleSubmit, formState: {errors}, setError, clearErrors} = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit = async data => {
        try {
            let response = await authAPI.login(data)
            localStorage.setItem('token', response.token);
            localStorage.setItem('id', response._id);
            dispatch(setUserProfile(response.fullName, response._id))
            getCurrentAxiosInstance()
        } catch (e) {
            setError('server', {
                type: "custom",
                message: 'Не верное имя пользователя или пароль'
            })

        }
    };

    const changeTab = () => {
        setTab(1)
    }

    const className = (filedName) => {

        if (errors[filedName] || errors.server) {
            return 'form-reg_input  form-reg_input--error'
        }

        return 'form-reg_input'
    }

    const clearError = (e, filed) => {
        clearErrors([filed])
        clearErrors('server')
    }

    return (

        <Box sx={style}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h3 className='form-reg_title'>Авторизация</h3>
                <div className='form-reg_fields'>
                    <label className='form-reg_label'>
                        <div>
                            <span className='form-reg_desc'>Email</span>
                            <input className={className('email')}
                                   {...register("email")}
                                   onChange={e => clearError(e, "email")}
                            />
                        </div>
                        <p className='form_error'>{errors.email?.message}</p>
                        {errors.server && <p className='form_error'>{errors.server?.message}</p>}
                    </label>

                    <label className='form-reg_label'>
                        <div>
                            <span className='form-reg_desc'>Пароль</span>
                            <input className={className('password')} type='password'
                                   {...register("password")}
                                   onChange={e => clearError(e, "password")}
                            />
                        </div>
                        <p className='form_error'>{errors.password?.message}</p>
                    </label>
                </div>
                <div className='auth_btns'>
                    <button className='btn' style={{
                        marginRight: '10px'
                    }} type='submit'>Войти
                    </button>
                    <button className='btn' onClick={changeTab}>Зарегистрироваться</button>
                </div>
            </form>


        </Box>
    )
}

export default Authorization