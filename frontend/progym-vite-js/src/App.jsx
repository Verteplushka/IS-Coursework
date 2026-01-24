import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegistrationPage from "./components/RegistrationPage";
import UserForm from "./components/UserForm";
import Home from "./components/home/Home";
import History from "./components/history/History";
import Profile from "./components/profile/Profile";
import TrainingCalendar from "./components/TrainingCalendar";
import CreateExercise from "./components/CreateExercise";
import CreateMeal from "./components/CreateMeal";
import CreateAllergy from "./components/CreateAllergy";
import CreateDietDay from "./components/CreateDietDay";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/UserForm" element={<UserForm />} />
        <Route path="/history" element={<History />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/TrainingCalendar" element={<TrainingCalendar />} />
        <Route path="/CreateExercise" element={<CreateExercise />} />
        <Route path="/CreateMeal" element={<CreateMeal />} />
        <Route path="/CreateAllergy" element={<CreateAllergy />} />
        <Route path="/CreateDietDay" element={<CreateDietDay />} />
      </Routes>
    </Router>
  );
}

export default App;
