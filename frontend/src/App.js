
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Header from './Components/Header';
import Login from './Components/Login/Login';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loadUser } from './Actions/User';
import Home from './Components/Home/Home';
import Account from './Components/Account/Account';
import NewPost from './Components/NewPost/NewPost';
import Register from './Components/Register/Register';
import UpdateProfile from './Components/UpdateProfile/UpdateProfile';
import UpdatePassword from './Components/UpdatePassword/UpdatePassword';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import ResetPassword from './Components/ResetPassword/ResetPassword';

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
        <Route path="/" element={ isAuthenticated ? <Home/> : <Login />} />
      </Routes>
      <Routes>
        <Route path="/account" element={ isAuthenticated ? <Account/> : <Login />} />
      </Routes>

         <Routes>
        <Route path="/newpost" element={ isAuthenticated ? <NewPost/> : <Login />} />
      </Routes>

      <Routes>
          <Route
          path="/register"
          element={isAuthenticated ? <Account /> : <Register />}
        />
      </Routes>

         <Routes>
          <Route
          path="/update/profile"
          element={isAuthenticated ? <UpdateProfile /> : <Login />}
        />
      </Routes>

          <Routes>
          <Route
          path="/update/password"
          element={isAuthenticated ? <UpdatePassword /> : <Login />}
        />
      </Routes>

         <Routes>
          <Route
          path="/forgot/password"
           element={isAuthenticated ? <UpdatePassword /> : <ForgotPassword />}
        />
      </Routes>
      
      <Routes>
         <Route
          path="/password/reset/:token"
          element={isAuthenticated ? <UpdatePassword /> : <ResetPassword />}
        />

        
      </Routes>
      
    
   </Router>
  );
}

export default App;
