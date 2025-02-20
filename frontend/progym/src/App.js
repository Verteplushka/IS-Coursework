import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage"; // Убедись, что путь правильный
import RegistrationPage from "./components/RegistrationPage"; // Импортируем страницу регистрации
import UserForm from "./components/UserForm"; // Импортируем страницу по заполнению данных пользователя
import Home from "./components/Home"; // Импортируем страницу по заполнению данных пользователя

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/UserForm" element={<UserForm />} />
        <Route path="/history" element={<History />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
