import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Error from "./Error";

function RegisterPage() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleReg = async () => {
    if(!password || !login){
      setError('Заполните все поля!')
      setTimeout(() => setError(''), 3000)
      return
    }
    const response = await fetch('http://localhost:3001/register', {
      method: 'post',
      headers: {'Content-type' : 'application/json'},
      body: JSON.stringify({login, password})
    })
    const data = await response.json()
    if(response.ok){
      setLogin('')
      setPassword('')
      console.log('Регистрация');
    } else {
      setError(data.error);
      setTimeout(()=> setError(''), 3000)
    }
  }

  return (
    <>
      <Error message={error} />
      <div>
        <h2>Регистрация</h2>
        <input type="text" placeholder="Логин" value={login} onChange={(e)=> setLogin(e.target.value)}/>
        <input type="password" placeholder="Пароль" value={password} onChange={(e)=> setPassword(e.target.value)}/>
        <button onClick={handleReg}>Зарегистрироваться</button>
      </div>
    </>
  );
}

export default RegisterPage;