import { useLocation } from "react-router-dom";
import AppRoutes from "../routes/AppRoutes";

function App() {
  const location = useLocation();

  // Hide Navbar on Login page
  const hideNavbar = location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <AppRoutes />
    </>
  );
}

export default App;