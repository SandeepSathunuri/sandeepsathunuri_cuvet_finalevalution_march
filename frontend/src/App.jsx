// import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/signUp';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} /> */
      </Routes>
    </div>
  );
}

export default App;
