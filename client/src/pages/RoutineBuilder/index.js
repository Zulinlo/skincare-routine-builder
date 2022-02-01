import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { BsPlus } from "react-icons/bs";
import { AiFillCaretRight, AiFillCloseCircle } from "react-icons/ai";

import { ReactComponent as Logo } from "utils/favicon.svg";
import { useAuth } from "contexts/AuthContext";
import Button from "components/Button";

import "./styles.scss";

const RoutineBuilder = () => {
  const [isRoutineDay, setIsRoutineDay] = useState(true);
  const [routineItems, setRoutineItems] = useState([]);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newItemState, setNewItemState] = useState(0);
  const [showDeleteItem, setShowDeleteItem] = useState(null)
  const { currentUser, logout } = useAuth();
  const newItem = useRef(null);
  const navigate = useNavigate();

  const toggleRoutine = () => {
    setIsRoutineDay(preState => !preState);
  };

  const initiateNewItem = () => {
    newItem.current = {};
    setNewItemState(1);
  };

  const nextNewItemStep = (e) => {
    newItem.current = { step: e.target.innerHTML };
    setNewItemState(2);
  };

  const nextNewItemConcern = (e) => {
    activeButtons.current[0] = concerns.indexOf(e.target.innerHTML);
    newItem.current = { ...newItem.current, concern: e.target.innerHTML };
    setNewItemState(3);

    if (Object.keys(newItem.current).length === 3)
      getRecommendations();
  };

  const nextNewItemSkin = (e) => {
    activeButtons.current[1] = skinTypes.indexOf(e.target.innerHTML);
    newItem.current = { ...newItem.current, skinType: e.target.innerHTML };
    setNewItemState(4);

    if (Object.keys(newItem.current).length === 3)
      getRecommendations();
  };

  const getRecommendations = () => {
    setIsLoading(true);

    let stepConverted = newItem.current.step.toLowerCase();
    switch (stepConverted) {
      case "oil cleanser":
        stepConverted = "oilCleanser";
        break;
      
      case "serum":
        stepConverted = "serumEssence";
        break;
      
      case "eye care":
        stepConverted = "eyeTreatment";
        break;
    }

    fetch(`http://localhost:8080/api/products?concern=${newItem.current.concern.toLowerCase()}&skinType=${newItem.current.skinType.toLowerCase()}&step=${stepConverted}&isSensitive=false`)
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data.sort((a,b) => b.numberOfReviews - a.numberOfReviews));
        setIsLoading(false);
      })
  }

  const updateRoutine = (routine) => {
    fetch(`http://localhost:8080/api/users/${currentUser.uid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isRoutineDay,
        routine
      })
    }) 
    .catch((err) => console.error(err));
  }

  const addRoutineItem = (productId, imagePath, step) => {
    let res = {productId, imagePath, step}
    const newRoutine = [...routineItems, res];
    setRoutineItems(newRoutine);
    newItem.current = null;
    activeButtons.current = [null, null];
    updateRoutine(newRoutine);
  }

  const deleteRoutineItem = (routineIdx) => {
    const newRoutine = routineItems.filter((item, i) => i !== routineIdx);
    setRoutineItems(newRoutine);
    updateRoutine(newRoutine);
  }

  const onDragEnd = (result) => {
    if (!result.destination)
      return;

    const newRoutine = [...routineItems];
    const [removed] = newRoutine.splice(result.source.index, 1);
    newRoutine.splice(result.destination.index, 0, removed);
    setRoutineItems(newRoutine);
    updateRoutine(newRoutine);
  }

  const getRoutineItems = () => {
    fetch(`http://localhost:8080/api/users/${currentUser.uid}?isRoutineDay=${isRoutineDay}`)
      .then(response => response.json())
      .then(data => {
        setRoutineItems(data)
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    getRoutineItems();
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
  const ingredientRatings = [
    "POOR",
    "AVERAGE",
    "GOOD",
    "BEST"
  ]
  const ingredientRatingsColor = [
    "#C50501",
    "#F89655",
    "#2AA827",
    "#00749A"
  ]
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
      {newItem.current !== null && Object.keys(newItem.current).length === 0 && (
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
      {newItem.current !== null &&
        (Object.keys(newItem.current).length === 1 ||
          Object.keys(newItem.current).length === 2) && (
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
      {newItem.current !== null && Object.keys(newItem.current).length > 2 && (
        <div className="new-item-recommendations">
          <h1>Product Recommendations</h1>
          {isLoading ? <h3>Is Loading...</h3> : ( recommendations.length === 0 ? <h2>No products</h2> : recommendations.map((v, i) => (
            <div key={v._id} className="recommendation" onClick={() => addRoutineItem(v._id, v.imagePath, v.step)}>
              <img src={require(`../../utils/productImages/${v.imagePath}`)} />
              <div>
                <div className="recommendation__name">{v.name}</div>
                <div className="recommendation__brand">by {v.brand}</div>
                <div className="recommendation__price"><b>Price: </b>${v.price}</div>
                <div className="recommendation__reviews"><b>Rating: </b>{v.averageReview} ({v.numberOfReviews})</div>
                <div className="recommendation__volume"><b>Volume: </b>{v.volume}</div>
                <div className="recommendation__description"><b>Description: </b>{v.description}</div>
                <div className="recommendation__directions"><b>Directions: </b>{v.directions}</div>
                <div className="recommendation__ingredients"><b>Ingredient breakdown: </b>{v.ingredients.map((v, i) => (
                  <div key={i} title={ingredientRatings[v.rating] || "UNKNOWN"} style={{color: ingredientRatingsColor[v.rating]}}>
                    {v.name}
                    <p><i>{v.purpose}</i></p>
                  </div>
                ))}</div>
              </div>
            </div>
          )))}
        </div>
      )}
        <section className={"routine" + (newItem.current ? " side" : "")}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable direction="horizontal" droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`routine-main ${!routineItems ? "routine-main-center" : ""}`}
                >
                  {routineItems && routineItems.map((item, i) => (
                    <Draggable 
                      key={item.productId}
                      draggableId={item.productId}
                      index={i}
                      onMouseEnter={() => setShowDeleteItem(item.productId)}
                      onMouseLeave={() => setShowDeleteItem(null)}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="routine-main-scroll"
                        >
                          <div className="routine-main-delete" style={showDeleteItem === item.productId ? { "display": "flex" } : { "display": "none"}} onClick={() => deleteRoutineItem(i)}>
                            <AiFillCloseCircle fill="red" style={{ "background": "black", "borderRadius": "50%", "width": "100%", "height": "100%" }} />
                          </div>
                          <h2>
                            {(() => {
                              let res = item.step.charAt(0).toUpperCase() + item.step.slice(1);
                              switch (res) {
                                case "OilCleanser":
                                  return "Oil Cleanser";
                                
                                case "SerumEssence":
                                  return "Serum";
                              }
                              return res;
                            })()}
                          </h2>
                          <img src={require(`../../utils/productImages/${item.imagePath}`)} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {!newItem.current && (
                    <div className="routine-main-add" onClick={initiateNewItem}>
                      <BsPlus fill="#C4C4C4" />
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </section>
    </div>
  );
};

export default RoutineBuilder;
