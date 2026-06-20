import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

function Profile() {
  const [user, setUser] =
    useState({});

  const userId =
    localStorage.getItem(
      "userId"
    );

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile =
    async () => {
      try {
        const res =
          await axios.get(
            `http://localhost:5000/api/users/${userId}`
          );

        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <img
          src={
            user.profileImage ||
            `https://ui-avatars.com/api/?name=${user.name}`
          }
          alt=""
          className="profile-image"
        />

        <h2>{user.name}</h2>

        <p>{user.email}</p>

        <p>{user.designation}</p>

        <p>{user.bio}</p>
      </div>
    </div>
  );
}

export default Profile;