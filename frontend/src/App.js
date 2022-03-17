
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Header from './Components/Header';
import Login from './Components/Login/Login';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loadUser } from './Actions/User';

function App() {

  const dispatch = useDispatch();
  useEffect( () => {
    dispatch( loadUser() );
  }, [] );

  const { isAuthenticated } = useSelector( ( state ) => state.user );

  return (
    <Router>
      {
        isAuthenticated &&  <Header />
     }

      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
   </Router>
  );
}

export default App;
