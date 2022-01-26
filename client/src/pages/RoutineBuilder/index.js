import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsPlus } from "react-icons/bs";
import { AiFillCaretRight } from "react-icons/ai";

import { ReactComponent as Logo } from "utils/favicon.svg";
import { useAuth } from "contexts/AuthContext";
import Button from "components/Button";

import "./styles.scss";

const RoutineBuilder = () => {
  const [isRoutineDay, setIsRoutineDay] = useState(true);
  const [routineItems, setRoutineItems] = useState([]);
  const [newItem, setNewItem] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const toggleRoutine = () => {
    setIsRoutineDay(!isRoutineDay);
  };

  const initiateNewItem = () => {
    setNewItem({});
  };

  const nextNewItemStep = (e) => {
    setNewItem({ step: e.target.innerHTML });
  };

  const nextNewItemConcern = (e) => {
    activeButtons.current[0] = concerns.indexOf(e.target.innerHTML);
    setNewItem({ ...newItem, concern: e.target.innerHTML });
  };

  const nextNewItemSkin = (e) => {
    activeButtons.current[1] = skinTypes.indexOf(e.target.innerHTML);
    console.log(activeButtons);
    setNewItem({ ...newItem, skinType: e.target.innerHTML });
  };

  const getRoutineItems = (routineDay) => {
    return "hi";
  };

  useEffect(() => {
    getRoutineItems();
    setRoutineItems([
      { hi: "h", bi: "by" },
      { ke: "val", be: "bal" },
    ]);
  }, [isRoutineDay]);

  const steps = [
    "Cleanser",
    "Oil Cleanser",
    "Toner",
    "Exfoliant",
    "Serum",
    "Moisturiser",
    "Mask",
    "Eye Care",
    "Sunscreen",
  ];
  const concerns = [
    "Hydration",
    "Acne",
    "Pigmentation",
    "Irritation",
    "Ageing",
  ];
  const skinTypes = ["Dry", "Oily", "Combination", "Normal"];
  const activeButtons = useRef([null, null]);

  const handleLogout = async () => {
    setError("");

    try {
      await logout();
      navigate("/");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <div className="routine-body">
      <nav className="navbar">
        <Link
          to="/"
          style={{ textDecoration: "none", color: "white" }}
          className="navbar-logo"
        >
          <Logo fill="#fff" width="45px" />
          <h1>Skincare Routine Builder</h1>
        </Link>
        <span className="navbar-routine" onClick={toggleRoutine}>
          <span>{(isRoutineDay ? "Day" : "Night") + " Routine"}</span>{" "}
          <AiFillCaretRight size="1rem" className="navbar-routine-caret" />
        </span>
        <Button backgroundColor="#2B464D" color="#FFF" onClick={handleLogout}>
          Log out
        </Button>
      </nav>
      {newItem !== null && Object.keys(newItem).length === 0 && (
        <div className="new-item">
          <h2>Pick a step</h2>
          {steps.map((v, i) => (
            <button
              key={i}
              className="button"
              onClick={(e) => {
                nextNewItemStep(e);
              }}
            >
              {v}
            </button>
          ))}
        </div>
      )}
      {newItem !== null &&
        (Object.keys(newItem).length === 1 ||
          Object.keys(newItem).length === 2) && (
          <div className="new-item">
            <h2>Concern</h2>
            {concerns.map((v, i) => (
              <button
                key={i}
                className={
                  "button" + (activeButtons.current[0] === i ? " active" : "")
                }
                onClick={(e) => {
                  nextNewItemConcern(e);
                }}
              >
                {v}
              </button>
            ))}
            <h2>Skin Type</h2>
            {skinTypes.map((v, i) => (
              <button
                key={i}
                className={
                  "button" + (activeButtons.current[1] === i ? " active" : "")
                }
                onClick={(e) => nextNewItemSkin(e)}
              >
                {v}
              </button>
            ))}
          </div>
        )}
      {newItem !== null && Object.keys(newItem).length > 2 && (
        <div className="new-item-reccomendations">
          <h1>Recommendations</h1>
        </div>
      )}
      <section className={"routine" + (newItem ? " side" : "")}>
        <div className="routine-main">
          {routineItems.map((item, i) => {
            return <div key={i}>hi</div>;
          })}
          {!newItem && (
            <div className="routine-main-add" onClick={initiateNewItem}>
              <BsPlus fill="#C4C4C4" />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default RoutineBuilder;
