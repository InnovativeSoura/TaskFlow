import AppRoutes from "./routes/AppRoutes";
import NotificationListener from "./components/NotificationListener";

function App() {
  return <AppRoutes />;
}

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <NotificationListener userId={user?._id} />
      <AppRoutes />
    </>
  );
}

export default App;