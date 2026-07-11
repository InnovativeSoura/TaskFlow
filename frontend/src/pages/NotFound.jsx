import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="not-found">

    <h1>404</h1>

    <p>Page Not Found</p>

    <Link to="/">
      Go Home
    </Link>

  </div>
);

export default NotFound;