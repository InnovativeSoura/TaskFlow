import { getUsers } from "./userService";
import { getProjects } from "./projectService";
import { getTasks } from "./taskService";

export const getDashboardStats = async () => {
  const [
    users,
    projects,
    tasks,
  ] = await Promise.allSettled([
    getUsers(),
    getProjects(),
    getTasks(),
  ]);

  return {
    users:
      users.status === "fulfilled"
        ? users.value.data
        : [],

    projects:
      projects.status === "fulfilled"
        ? projects.value.data
        : [],

    tasks:
      tasks.status === "fulfilled"
        ? tasks.value.data
        : [],
  };
};