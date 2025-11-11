import { Navigate, Route, Routes } from 'react-router';
import UserProfileView from './pages/userProfile/UserProfileView';
import UserProfileEdit from './pages/userProfile/UserProfileEdit';
import Employees from "./pages/employees/Employees";
import Teams from "./pages/teams/Teams";
import About from "./pages/index/About";
import { Login, Register } from "./pages/auth";
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

export default function App() {

  return (
    <Routes>
      {/* Main application routes (with header) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={(<Navigate to="/me" replace={true}/>)} />

        <Route path="/me" element={<UserProfileView/>}/>
        <Route path="/me/edit" element={<UserProfileEdit />}/>
        <Route path="/employees" element={<Employees />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/about" element={<About />} />
      </Route>

      {/* Auth routes (no header) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  )
}
