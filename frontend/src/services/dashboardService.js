import {
  getUsers,
} from "./userService";

import {
  getProjects,
} from "./projectService";

import {
  getTasks,
} from "./taskService";

export const getDashboardStats = async () => {

  const [users, projects, tasks] =
    await Promise.all([
      getUsers(),
      getProjects(),
      getTasks(),
    ]);

  return {
    users: users.data,
    projects: projects.data,
    tasks: tasks.data,
  };

};