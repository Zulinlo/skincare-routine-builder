import { Link } from "react-router-dom";

import "./styles.scss";

import "components/form.scss";
import { ReactComponent as Logo } from "utils/favicon.svg";

const Login = () => {
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
      <div className="form">
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
          <input type="text" />
        </div>
        <div className="form-input">
          <span>Password</span>
          <input type="password" />
        </div>
        <input type="button" className="form-submit" value="Login" />
        <span className="form-forgot-password">
          Forgot your password?{" "}
          <Link
            to="/login"
            style={{ textDecoration: "none", color: "#3C4DE9" }}
          >
            Click here
          </Link>
        </span>
      </div>
    </>
  );
};

export default Login;
