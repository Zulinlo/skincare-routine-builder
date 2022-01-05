import { Link } from "react-router-dom";

import "components/form.scss";
import "./styles.scss";

import { ReactComponent as Logo } from "utils/favicon.svg";

const Register = () => {
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
        <h1>Let's create an account!</h1>
        <span className="form-register">
          Build the perfect routine with us for you.
        </span>
        <div className="form-input">
          <span>Email</span>
          <input type="text" />
        </div>
        <div className="form-input">
          <span>Password</span>
          <input type="password" />
        </div>
        <div className="form-input">
          <span>Confirm password</span>
          <input type="text" />
        </div>
        <div className="form-input-two">
          <div className="form-input" style={{ width: "50%" }}>
            <span>Skin type</span>
            <select>
              <option value="dry">Dry</option>
              <option value="normal" selected>
                Normal
              </option>
              <option value="oily">Oily</option>
              <option value="combination">Combination</option>
            </select>
          </div>
          <div className="form-input">
            <span>Sensitive skin</span>
            <select style={{ width: "60%" }}>
              <option value="yes">Yes</option>
              <option selected value="no">
                No
              </option>
            </select>
          </div>
        </div>
        <div className="form-input">
          <span>Pick a starting routine template</span>
          <select style={{ width: "30%", marginTop: "1%" }}>
            <option selected value="simple">
              Simple
            </option>
            <option selected value="complex">
              Complex
            </option>
          </select>
        </div>
        <input type="button" className="form-submit" value="Continue" />
        <span className="form-forgot-password">
          Already registered?{" "}
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

export default Register;
