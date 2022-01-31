import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ReactComponent as Logo } from "utils/favicon.svg";
import { useAuth } from "contexts/AuthContext";

import "components/form.scss";
import "./styles.scss";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [skinType, setSkinType] = useState("normal");
  const [isSensitive, setIsSensitive] = useState("no");
  const [startingTemplate, setStartingTemplate] = useState("simple");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const getStepRecommendation = async (step) => {
    const response = await fetch(`http://localhost:8080/api/products?concern=null&skinType=${skinType}&step=${step}&isSensitive=${isSensitive}`);
    const payload = await response.json();
    const res = payload[0];
    return res ? { productId: res._id, imagePath: res.imagePath, step } : null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setError("");
    setLoading(true);
    register(email, password)
      .then(async (data) => {
        let uuid = data.user.uid;
        const dayRoutine = [];
        const nightRoutine = [];
        let cleanser = await getStepRecommendation("cleanser");
        let oilCleanser = await getStepRecommendation("oilCleanser");
        let toner = await getStepRecommendation("toner");
        let exfoliant = await getStepRecommendation("exfoliant");
        let serum = await getStepRecommendation("serumEssence");
        let moisturiser = await getStepRecommendation("moisturiser");
        let sunscreen = await getStepRecommendation("sunscreen");

        if (startingTemplate === "simple") {
          dayRoutine.push(cleanser, moisturiser, sunscreen);
          nightRoutine.push(cleanser, oilCleanser, moisturiser);
        } else {
          dayRoutine.push(cleanser, toner, serum, moisturiser, sunscreen);
          nightRoutine.push(cleanser, oilCleanser, toner, exfoliant, serum, moisturiser);
        }

        dayRoutine.filter(v => v); // filter null
        nightRoutine.filter(v => v ); // filter null

        await fetch(`http://localhost:8080/api/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json"},
          body: JSON.stringify({
            uuid,
            skinType,
            isSensitive: isSensitive === "yes",
            dayRoutine,
            nightRoutine
          })
        });

        setError("Account successfully created.");
        return navigate("/routine-builder");
      })
      .catch((err) => setError(`Failed to create an account. ${err}`));

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
        <h1>Let's create an account!</h1>
        <span className="form-register">
          Build the perfect routine with us for you.
        </span>
        <div className="form-input">
          <span>Email</span>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-input">
          <span>Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="form-input">
          <span>Confirm password</span>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <div className="form-input-two">
          <div className="form-input" style={{ width: "50%" }}>
            <span>Skin type</span>
            <select value={skinType} onChange={(e) => setSkinType(e.target.value)}>
              <option value="dry">Dry</option>
              <option value="normal">
                Normal
              </option>
              <option value="oily">Oily</option>
              <option value="combination">Combination</option>
            </select>
          </div>
          <div className="form-input">
            <span>Sensitive skin</span>
            <select style={{ width: "60%" }} value={isSensitive} onChange={(e) => setIsSensitive(e.target.value)}>
              <option value="yes">Yes</option>
              <option value="no">
                No
              </option>
            </select>
          </div>
        </div>
        <div className="form-input">
          <span>Pick a starting routine template</span>
          <select style={{ width: "30%", marginTop: "1%" }} value={startingTemplate} onChange={(e) => setStartingTemplate(e.target.value)}>
            <option value="simple">
              Simple
            </option>
            <option value="complex">
              Complex
            </option>
          </select>
        </div>
        <button type="submit" className="form-submit">Continue</button>
        <span className="form-forgot-password">
          Already registered?{" "}
          <Link
            to="/login"
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

export default Register;
