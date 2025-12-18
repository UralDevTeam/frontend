import {Navigate, Route, Routes} from 'react-router';
import {routes} from './shared/routes';
import UserProfileView from './pages/userProfile/UserProfileView';
import UserProfileEdit from './pages/userProfile/UserProfileEdit';
import UserProfileByIdView from './pages/userProfile/UserProfileByIdView';
import UserProfileEditById from './pages/userProfile/UserProfileEditById';
import Employees from "./pages/employees/Employees";
import Teams from "./pages/teams/Teams";
import About from "./pages/about/About";
import {Login, Register} from "./pages/auth";
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

export default function App() {

    return (
        <Routes>
            {/* Main application routes (with header) */}
            <Route element={<MainLayout/>}>
                <Route path={routes.root()} element={(<Navigate to={routes.me()} replace={true}/>)}/> 

                <Route path={routes.me()} element={<UserProfileView/>}/> 
                <Route path={routes.meEdit()} element={<UserProfileEdit/>}/> 
                <Route path={routes.employees()} element={<Employees/>}/> 
                <Route path={routes.teams()} element={<Teams/>}/> 
                <Route path={routes.about()} element={<About/>}/> 
                <Route path={routes.profileView()} element={<UserProfileByIdView/>}/> 
                <Route path={routes.profileEdit()} element={<UserProfileEditById/>}/> 
            </Route>

            {/* Auth routes (no header) */}
            <Route element={<AuthLayout/>}>
                <Route path={routes.login()} element={<Login/>}/>
                <Route path={routes.register()} element={<Register/>}/> 
            </Route>
        </Routes>
    )
}
