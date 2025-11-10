import Header from "../../entries/header/header";
import {Navigate, Route, Routes, useParams} from 'react-router';
import "./profile.css";
import UserProfileView from '../userProfile/UserProfileView';
import UserProfileEdit from '../userProfile/UserProfileEdit';
import Employees from "../employees/Employees";
import Teams from "../teams/Teams";
import {currentUser, mockUsersById} from "../../mocks/users";
import {User} from "../../entries/user";
import About from "./About";


function UserProfileByIdView() {
    const {id} = useParams<{ id: string }>();
    const user: User | undefined = id ? mockUsersById[id] : undefined;
    if (!user) {
        return <Navigate to="/me" replace={true}/>;
    }

    return (
        <UserProfileView
            user={user}
            canEdit={false}
            viewPath={`/profile/view/${id}`}
        />
    );
}

export function Page() {
    return (
        <>
            <Header/>
            <main className="main">
                <Routes>
                    <Route path="/" element={<Navigate to="/me" replace={true}/>}/>

                    <Route
                        path="/me"
                        element={(
                            <UserProfileView
                                user={currentUser}
                                canEdit={true}
                                viewPath="/me"
                                editPath="/me/edit"
                            />
                        )}
                    />
                    <Route
                        path="/me/edit"
                        element={<UserProfileEdit initialUser={currentUser} viewPath="/me"/>}
                    />
                    <Route path="/profile/view/:id" element={<UserProfileByIdView/>}/>
                    <Route path="/employees" element={<Employees/>}/>
                    <Route path="/teams" element={<Teams/>}/>
                    <Route path="/about" element={<About />} />
                    <Route path="*" element={<Navigate to="/me" replace={true}/>}/>
                </Routes>
            </main>
        </>
    );
}
