import { useEffect } from "react";

import AppRoutes from "./routes/AppRoutes";
import NotificationListener from "./components/NotificationListener";

import {
connectSocket,
disconnectSocket,
} from "./socket/socket";

function App() {
const user = JSON.parse(
localStorage.getItem("user")
);

useEffect(() => {
if (user) {
connectSocket();
}


return () => {
  disconnectSocket();
};


}, [user]);

return (
<> <NotificationListener
     userId={user?._id}
   />


  <AppRoutes />
</>


);
}

export default App;
