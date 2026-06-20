import { useEffect, useState } from "react";
import API from "../api/axios";

function Team() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await API.get(
        "/users"
      );

      setMembers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Team Members
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {members.map((member) => (
          <div
            key={member._id}
            className="bg-slate-800 p-5 rounded-xl"
          >
            <img
              src={
                member.profileImage ||
                "https://ui-avatars.com/api/?name=" +
                  member.name
              }
              alt=""
              className="w-16 h-16 rounded-full"
            />

            <h2 className="mt-4 text-lg">
              {member.name}
            </h2>

            <p className="text-slate-400">
              {member.email}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Team;