import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import React from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import SendIcon from "@mui/icons-material/Send";
import {useDispatch} from "react-redux";
import {getRegisterUser, setUserProfile} from "../../redux/authReducer";
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
    fullName: yup.string().required('Обязательно к заполнению').min(3, 'Логин должен быть более 3 символов'),
    email: yup.string().email('Некорректный email').required('Обязательно к заполнению'),
    password: yup.string().required('Обязательно к заполнению').min(6, 'Пароль должен быть более 6 символов'),
    passwordCheck: yup.string().oneOf([yup.ref('password'), null], 'Пароли не совпадают').required('Обязательно к заполнению')
}).required();


function Registration({setTab}) {
    const dispatch = useDispatch()
    const {register, handleSubmit, formState: {errors}, setError, clearErrors} = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit = async  data => {
       try {
           let response = await authAPI.register(data)
           localStorage.setItem('token', response.token);
           localStorage.setItem('id', response._id);
           dispatch(setUserProfile(response.fullName, response._id))
           getCurrentAxiosInstance()
       }
       catch (e) {
           setError('email', {
               type: "custom",
               message: 'Пользователь с такой почтой уже существует'
           })

       }
    };

    const changeTab = () => {
        setTab(0)
    }

    const className = (filedName) => {

        if (errors[filedName] || errors[filedName]?.type === 'custom') {
            return 'form-reg_input  form-reg_input--error'
        }

        return 'form-reg_input'
    }

    const clearError = (e, filed) => {
        clearErrors([filed])
    }

    return (

        <Box sx={style}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h3 className='form-reg_title'>Регистрация</h3>
                <div className='form-reg_fields'>

                    <label className='form-reg_label'>
                        <div>
                            <span className='form-reg_desc'>Логин</span>
                            <input className={className('fullName')}
                                   {...register("fullName")}
                                   onChange={e => clearError(e,"fullName")}
                            />
                        </div>
                        <p className='form_error'>{errors.fullName?.message}</p>
                    </label>
                    <label className='form-reg_label'>
                        <div>
                            <span className='form-reg_desc'>Email</span>
                            <input className={className('email')}
                                   {...register("email")}
                                   onChange={e => clearError(e,"email")}
                            />
                        </div>
                        <p className='form_error'>{errors.email?.message}</p>
                    </label>

                    <label className='form-reg_label'>
                        <div>
                            <span className='form-reg_desc'>Пароль</span>
                            <input className={className('password')} type='password'
                                   {...register("password")}
                                   onChange={e => clearError(e,"password")}
                            />
                        </div>
                        <p className='form_error'>{errors.password?.message}</p>
                    </label>
                    <label className='form-reg_label'>
                        <div>
                            <span className='form-reg_desc'>Подтвердить пароль</span>
                            <input className={className('passwordCheck')} type='password'
                                   {...register("passwordCheck")}
                                   onChange={e => clearError(e,"passwordCheck")}
                            />
                        </div>
                        <p className='form_error'>{errors.passwordCheck?.message}</p>
                    </label>
                </div>
                <div className='auth_btns'>
                    <button className='btn' style={{
                        marginRight: '10px'
                    }} type='submit'>Зарегистрироваться
                    </button>
                    <button className='btn' onClick={changeTab}>Eсть уже аккаунт?</button>
                </div>
            </form>
        </Box>
    )
}

export default Registration;