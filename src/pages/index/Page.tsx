import Header from "../../entries/header/header";
import "./profile.css"
import {Navigate, Route, Routes} from 'react-router';
import UserProfileView from '../userProfile/UserProfileView';
import UserProfileEdit from '../userProfile/UserProfileEdit';
import Employees from "../employees/Employees";
import Teams from "../teams/Teams";
import About from "./About";
import { Login, Register } from "../auth";

export function Page() {

  return (
    <>
      <Header/>
      <main className="main">
        <Routes>
          <Route path="/" element={(
            <Navigate to="/profile/view" replace={true}/>
          )}/>

          <Route path="/profile/view" element={<UserProfileView/>}/>
          <Route path="/profile/edit" element={<UserProfileEdit />}/>
          <Route path="/employees" element={<Employees />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/about" element={<About />} />

          {/* Auth pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </>
  )
}
