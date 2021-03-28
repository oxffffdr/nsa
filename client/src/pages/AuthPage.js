import React, {useContext, useEffect, useState } from 'react'
import 'materialize-css'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext';



export const AuthPage =() =>{
  const auth = useContext(AuthContext)
  const message = useMessage()
    const {loading,  request, error, clearError}= useHttp()

    const [form, setForm]=useState({
        email: '',
        password: ''
    })
    useEffect( ()=>{
      message(error)
      clearError()
    },[error, message, clearError])

useEffect(()=>{
  window.M.updateTextFields()
},[])

    const changeHandler = event =>{
        setForm({...form,[event.target.name]: event.target.value})
    }

const registerHandler= async()=>{
  try {
      const data = await request('/api/auth/register','post',{...form})
      message(data.message)
  }
  catch(e){}

}

const loginHandler= async()=>{
  try {
      const data = await request('/api/auth/login','post',{...form})
      auth.login(data.token, data.userId)
  }
  catch(e){}

}

    return (
     <div className="row">
      <div className="col s6 offset-s3">
        <h1>N.A.S.A.</h1>
        <div className="card blue darken-1">
          <div className="card-content white-text">
            <span className="card-title">Авторизация</span>
                <div>
                    <div className="input-field">
                        <input 
                                placeholder="Введете e-mail" 
                                id="email" 
                                type="text"  
                                name="email"   
                                className="yellow-input"  
                                value = {form.email}
                                onChange={changeHandler}                          
                        />
                        <label htmlFor="first_name">email</label>
                    </div>

                     <div className="input-field">
                        <input
                             id="password" 
                             type="password"                              
                             placeholder="Введете пароль"
                             name="password"
                             className="yellow-input" 
                             value = {form.password}
                             onChange={changeHandler}                                                     
                        />
                        <label htmlFor="last_name">Password</label>
                    </div>
                </div>
          </div>
          <div className="card-action">
            <button className="btn yellow darken-4" style={{marginRight:10}} disabled={loading} onClick={loginHandler}>Войти</button>
            <button className="btn gray lighten-1 black-text" onClick={registerHandler} disabled={loading}>Регистрация</button>

          </div>
        </div>
      </div>
    </div>
    )
}
