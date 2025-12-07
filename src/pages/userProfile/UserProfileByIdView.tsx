import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {fetchUserById} from '../../entities/user/fetcher';
import UserPersonalInfoCardController from '../../entities/user/ui/UserPersonalInfoCardController';
import UserMainPropertiesView from '../../entities/user/ui/UserMainProperties/UserMainPropertiesView';
import UserBasicInfoCard from '../../entities/user/ui/UserBasicInfoCard/IUserBasicInfoCard';
import './profile.css';
import {User, userFromDto} from "../../entities/user";

export default function UserProfileByIdView() {
  const {id} = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    if (!id) return;

    const loadUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const dto = await fetchUserById(id);
        setUser(userFromDto(dto));
      } catch (e) {
        const error = e as Error;
        setError(error?.message ?? String(error));
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user</div>;


  return (
    <div className="user-profile-card">
      <UserMainPropertiesView user={user}/>
      <div className={"user-profile-content"}>
        <UserBasicInfoCard user={user}/>
        <UserPersonalInfoCardController
          user={user}
          isEdit={false}
          canEdit={false}
          editPath={`/profile/edit/${user.id}`}
          viewPath={`/profile/view/${user.id}`}
        />
      </div>
    </div>
  );
}

