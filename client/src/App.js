import logo from './logo.svg';
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import CreateOrder from './components/CreateOrder';
import Orders from './components/Orders';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Navigate to={'/login'} />}/>
        <Route path='/register' element={<RegisterPage />}/>
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/create' element={<CreateOrder />}/>
        <Route path='/orders' element={<Orders />}/>
      </Routes>
    </div>
  );
}

export default App;
