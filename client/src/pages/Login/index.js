import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ReactComponent as Logo } from "utils/favicon.svg";
import { useAuth } from "contexts/AuthContext";

import "components/form.scss";
import "./styles.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      return navigate("/routine-builder");
    } catch {
      setError("Failed to log in");
    }

    setLoading(false);
  }
  
  return (
    <>
      <Link to="/">
        <Logo
          className="form-logo"
          width="100px"
          fill="white"
          style={{ position: "absolute", top: "35px", left: "35px" }}
        />
      </Link>
      <form className="form" onSubmit={handleSubmit}>
        <h1>Welcome back!</h1>
        <span className="form-register">
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ textDecoration: "none", color: "#3C4DE9" }}
          >
            Click here
          </Link>
        </span>
        <div className="form-input">
          <span>Email</span>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className="form-input">
          <span>Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <button type="submit" className="form-submit">Login</button>
        <span className="form-forgot-password">
          Forgot your password?{" "}
          <Link
            to="/forgot-password"
            style={{ textDecoration: "none", color: "#3C4DE9" }}
          >
            Click here
          </Link>
        </span>
        {error && <span className="error">{error}</span>}
      </form>
    </>
  );
};

export default Login;
