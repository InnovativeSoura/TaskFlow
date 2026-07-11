import { useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  const handleLogin = async () => {
    // login logic

    navigate("/dashboard");
  };


  return (
    <button onClick={handleLogin}>
      Login
    </button>
  );
};

export default Login;