import { createContext, useState } from "react";

export const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [currentWorkspace, setCurrentWorkspace] = useState(null);

  return (
    <WorkspaceContext.Provider
      value={{ currentWorkspace, setCurrentWorkspace }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};