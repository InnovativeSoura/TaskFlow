import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">

      <div className="text-center">
        <h1 className="text-6xl font-bold mb-5">
          TaskFlow
        </h1>

        <p className="text-slate-400 mb-8">
          Smart Collaborative Project Management
        </p>

        <Link
          to="/login"
          className="bg-primary px-8 py-3 rounded-xl"
        >
          Get Started
        </Link>
      </div>

    </div>
  );
};

export default Home;