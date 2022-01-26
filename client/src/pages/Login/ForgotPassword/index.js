import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ReactComponent as Logo } from "utils/favicon.svg";
import { useAuth } from "contexts/AuthContext";

import "components/form.scss";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await forgotPassword(email);
      setMessage("Check your inbox for further instructions");
    } catch {
      setError("Failed to reset password");
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
        <h1>Forgot Password</h1>
        <div className="form-input">
          <span>Email</span>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <button type="submit" className="form-submit">Reset Password</button>
        <span className="form-forgot-password">
          Login{" "}
          <Link
            to="/login"
            style={{ textDecoration: "none", color: "#3C4DE9" }}
          >
            Click here
          </Link>
        </span>
        {error && <span className="error">{error}</span>}
        {message && <span className="message">{message}</span>}
      </form>
    </>
  );
};

export default ForgotPassword;
