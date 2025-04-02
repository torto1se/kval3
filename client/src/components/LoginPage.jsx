import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Error from "./Error";

function LoginPage() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLog = async () => {
    if(!password || !login){
      setError('Заполните все поля!')
      setTimeout(() => setError(''), 3000)
      return
    }
    const response = await fetch('http://localhost:3001/login', {
      method: 'post',
      headers: {'Content-type' : 'application/json'},
      body: JSON.stringify({login, password})
    })
    const data = await response.json()
    if(response.ok){
      setLogin('')
      setPassword('')
      navigate('/create')
      localStorage.setItem('token', data.token)
      localStorage.setItem('login', data.login)
      localStorage.setItem('id', data.userId)
      console.log('Вход');
    } else {
      setError(data.message);
      setTimeout(()=> setError(''), 3000)
    }
  }

  return (
    <>
      <Error message={error} />
      <div>
        <h2>Авторизация</h2>
        <input type="text" placeholder="Логин" value={login} onChange={(e)=> setLogin(e.target.value)}/>
        <input type="password" placeholder="Пароль" value={password} onChange={(e)=> setPassword(e.target.value)}/>
        <button onClick={handleLog}>Войти</button>
      </div>
    </>
  );
}

export default LoginPage;