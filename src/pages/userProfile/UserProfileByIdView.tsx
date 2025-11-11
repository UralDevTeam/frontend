import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { fetchUserById } from '../../entities/user/fetcher';
import { userFromDto } from '../../entries/user/userFromDto';
import UserPersonalInfoCardController from '../../entries/userInfo/UserPersonalInfoCardController';
import UserMainProperties from '../../entries/userInfo/UserMainProperties/IUserMainProperties';
import UserBasicInfoCard from '../../entries/userInfo/UserBasicInfoCard/IUserBasicInfoCard';
import { User } from '../../entries/user';
import './profile.css';

export default function UserProfileByIdView() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetchUserById(id)
      .then(dto => {
        setUser(userFromDto(dto));
      })
      .catch(e => {
        setError(e?.message ?? String(e));
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user</div>;

  return (
    <div className="simple-shadow-card user-profile-card">
      <UserMainProperties user={user} />
      <div className={"user-profile-content"}>
        <UserBasicInfoCard user={user} />
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

