import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Error from "./Error";

function Orders() {
  const [order, setOrder] = useState([])
  const [error, setError] = useState('')
  const token = localStorage.getItem('token')
  const login = localStorage.getItem('login')
  const navigate = useNavigate()
  useEffect(() => {
    if(!token){
      navigate('/login')
    } else {
      fetchOrders()
    }
  }, [navigate])

   const fetchOrders = async() => {
     const response = await fetch('http://localhost:3001/orders', {
      method: 'get',
      headers: {Authorization: `Bearer ${token}`}
    })
    const data = await response.json();
    if(response.ok){
      setOrder(data)
    } else {
      setError(data.message);
      setTimeout(()=> setError(''), 3000)
      if(response.status === 401){
        navigate('/login')
      }
      setOrder([])
    }
   }

  const updateStatus = async (id, status) => {
    const response = await fetch(`http://localhost:3001/order/${id}`, {
      method: 'put',
      headers: {authorization: `Bearer ${token}`, 'content-type' : 'application/json'},
      body: JSON.stringify({status})
    })
    const data = await response.json()
    if(response.ok){
      console.log(data.message);
      fetchOrders()
    } else {
      setError(data.message);
      setTimeout(()=> setError(''), 3000)
    }
  }

  const deleteOrder = async (id) => {
    const response = await fetch(`http://localhost:3001/order/${id}`, {
      method: 'delete',
      headers: {authorization: `Bearer ${token}`, 'content-type' : 'application/json'}
    })
    const data = await response.json()
    if(response.ok){
      fetchOrders()
      console.log(data.message);
    } else {
      setError(data.message);
      setTimeout(()=> setError(''), 3000)
    }
  }
  return (
    <>
      <Error message={error} />
      <div>
       {order.length > 0 ? (
         <table style={{borderCollapse: 'collapse', border: '1px solid black'}}>
          <thead>
            <tr style={{borderBottom: '1px solid black'}}>
              <th style={{borderRight: '1px solid black'}}>id</th>
              <th style={{borderRight: '1px solid black'}}>Заголовок</th>
              <th style={{borderRight: '1px solid black'}}>Описания</th>
              <th style={{borderRight: '1px solid black'}}>Дата</th>
              <th style={{borderRight: '1px solid black'}}>Заказчик</th>
              <th style={{borderRight: '1px solid black'}}>Статус</th>
            </tr>
          </thead>
          <tbody>
            {order.map((ord) => (
          <tr key={ord.id} style={{borderBottom: '1px solid black'}}>
            <td style={{borderRight: '1px solid black'}}>{ord.id}</td>
            <td style={{borderRight: '1px solid black'}}>{ord.title}</td>
            <td style={{borderRight: '1px solid black'}}>{ord.description}</td>
            <td style={{borderRight: '1px solid black'}}>{ord.date}</td>
            <td style={{borderRight: '1px solid black'}}>{ord.name}</td>
            <td style={{borderRight: '1px solid black'}}>
              {login === 'admin' ? (
                <select value={ord.status} onChange={e => updateStatus(ord.id, e.target.value)}>
                  <option value="Новое">Новое</option>
                  <option value="Подтверждено">Подтверждено</option>
                  <option value="Отменено">Отменено</option>
                </select>
              ) : (ord.status)}
            </td>
            {login === 'admin' ? (
              <td>
                <button onClick={() => deleteOrder(ord.id)}>Удалить</button>
              </td>
            ) : (<></>)}
          </tr>
        ))}
          </tbody>
        </table>
       ) : (<h2>Нет заказов</h2>)}
      </div>
    </>
  );
}

export default Orders;