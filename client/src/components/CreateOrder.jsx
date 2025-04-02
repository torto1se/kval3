import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Error from "./Error";

function CreateOrder() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if(!token){
      navigate('/login')
    }
  }, [navigate])

  const createOrder = async () => {
    if(!title || !description || !date){
      setError('Заполните все поля!')
      setTimeout(()=> setError(''), 3000)
      return
    }

    const response = await fetch('http://localhost:3001/create', {
      method: 'post',
      headers: {'content-type':'application/json', Authorization: `Bearer ${token}`},
      body: JSON.stringify({title, description, date})
    })

    const data = await response.json()
    if(response.ok){
      console.log(data.message);
      setTitle('')
      setDescription('')
      setDate('')
    } else{
      if(response.status === 401){
        navigate('/login')
      }
      setError(data.message);
      setTimeout(()=> setError(''), 3000)
    }
  }
  return (
    <>
      <Error message={error} />
      <div>
        <h2>Создание заказа</h2>
        <input type="text" value={title} placeholder="Заголовок" onChange={(e)=> setTitle(e.target.value)}/>
        <textarea type="text" value={description} placeholder="Описание" onChange={(e)=> setDescription(e.target.value)}/>
        <input type="date" value={date} onChange={(e)=> setDate(e.target.value)}/>
        <button onClick={createOrder}>Создать</button>
      </div>
    </>
  );
}

export default CreateOrder;