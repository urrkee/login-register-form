import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login/Login';
import Register from './register/Register';
import GetStarted from './get-started/GetStarted';
import UserPage from './user-page/userPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />{' '}
        <Route path="/user-page" element={<UserPage />} />
      </Routes>
    </Router>
  );
};

export default App;
