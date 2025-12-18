import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useParams} from 'react-router';
import {routes} from '../../shared/routes';
import UserProfileEdit from './UserProfileEdit';
import {fetchCurrentUser, fetchUserById} from '../../entities/user/fetcher';
import {User, userFromDto, userStore} from '../../entities/user';
import {saveUserByIdAdmin} from '../../features/editUser/saveUser';

function UserProfileEditById() {
    const {id} = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currentUser = userStore.user;
    const isAdmin = Boolean(currentUser?.isAdmin);
    const isSelf = currentUser?.id === id;

    useEffect(() => {
        if (!id) return;

        const loadUser = async () => {
            setLoading(true);
            setError(null);

            try {
                const dto = await fetchUserById(id);
                setUser(userFromDto(dto));
            } catch (e) {
                const err = e as Error;
                setError(err?.message ?? String(err));
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [id]);

    if (!isAdmin && !isSelf) {
        return <div>Недостаточно прав</div>;
    }

    if (!id) return <div>Нет выбранного пользователя</div>;
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>No user</div>;

    const handleAfterSave = () => {
        if (isSelf) {
            return userStore.loadUserFromApi(fetchCurrentUser);
        }
    };

    return (
        <UserProfileEdit
            initialUser={user}
            viewPath={routes.profileView(id)}
            saveUserFn={(updatedUser, originalUser) => {
                if (!originalUser) throw new Error("Original user is missing for admin update");
                return saveUserByIdAdmin(id, originalUser, updatedUser);
            }}
            afterSave={handleAfterSave}
            toSelf={isSelf}
            adminMode={true}
        />
    );
}

export default observer(UserProfileEditById);
