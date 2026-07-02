const data = await loginUser({ email, password });

localStorage.setItem("token", data.token);
setUser(data.user);