import { useEffect, useState } from "react";
import axios from "axios";

function Workspaces() {
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/workspaces"
    );

    setWorkspaces(res.data.workspaces);
  };

  return (
    <div>
      <h2>Your Workspaces</h2>

      {workspaces.map((w) => (
        <div key={w._id}>
          <h3>{w.name}</h3>
          <p>Members: {w.members.length}</p>
        </div>
      ))}
    </div>
  );
}

export default Workspaces;