import React from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import * as yup from "yup";
import {getAuthUser} from "../../redux/authReducer";
import {useDispatch} from "react-redux";

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
    email: yup.string().email().required(),
    password: yup.string().min(5).required()
}).required();


function Authorization({setTab}) {
    const dispatch = useDispatch()
    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema)
    });
    const onSubmit = data => {
        dispatch(getAuthUser(data))

    };

    const changeTab = () => {
        setTab(1)
    }

    return (

        <Box sx={style}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h3 className='form-reg_title'>Авторизация</h3>
                <div className='form-reg_fields'>
                    <label className='form-reg_label'>
                       <span className='form-reg_desc'>Email</span>
                        <input className='form-reg_input'
                               helperText={errors.email?.message}
                               {...register("email")}
                        />
                    </label>

                    <label className='form-reg_label'>
                        <span className='form-reg_desc'>Пароль</span>
                    <input className='form-reg_input'  type='password'
                               helperText={errors.password?.message}
                               {...register("password")}
                    />
                    </label>
                </div>
                <div className='auth_btns'>
                    <button className='btn' style={{
                        marginRight:'10px'
                    }} type='submit'>Войти</button>
                    <button className='btn' onClick={changeTab}>Зарегистрироваться</button>
                </div>
            </form>


        </Box>
    )
}

export default Authorization