import { FiTarget } from "react-icons/fi";
import { RiInkBottleFill } from "react-icons/ri";
import { BiAnalyse } from "react-icons/bi";

import "./styles.scss";

import Navbar from "components/Navbar";
import Footer from "components/Footer";
import Button from "components/Button";

const Home = () => {
  return (
    <>
      <Navbar />
      <section className="main-container">
        <div className="main-title">Create your perfect skincare routine</div>
        <div className="main-description">
          <div className="main-description-text">
            Receive tailored product reccomendations as you build your routine.
            <br />
            <Button link="/register" backgroundColor="#5B5B5B" marginTop="1rem">
              Get Started
            </Button>
          </div>
          <img src={require("../../utils/landing-hero-image.png")} />
        </div>
      </section>
      <section className="information-container">
        <div className="main-waves">
          <svg
            className="waves"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
            shapeRendering="auto"
          >
            <defs>
              <path
                id="gentle-wave"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              />
            </defs>
            <g className="parallax">
              <use
                xlinkHref="#gentle-wave"
                x="90"
                y="0"
                fill="rgba(220, 251, 255, 0.5)"
              />
              <use
                xlinkHref="#gentle-wave"
                x="60"
                y="3"
                fill="rgba(220, 251, 255, 0.3)"
              />
              <use xlinkHref="#gentle-wave" x="0" y="1" fill="#DCFBFF" />
            </g>
          </svg>
        </div>
        <div className="information-details-container">
          <div className="information-details-title">FEATURES</div>
          <div className="information-card-container">
            <div className="information-card">
              <div className="information-card-image">
                <FiTarget color="white" size="150" />
              </div>
              <h3>Target your concern</h3>
              <span>
                Use our smart algorithm to find the perfect product to eliminate
                your skin concern!
              </span>
            </div>
            <div className="information-card">
              <div className="information-card-image">
                <RiInkBottleFill color="white" size="150" />
              </div>
              <h3>1000+ amazing products</h3>
              <span>
                Our growing database of skincare products has the perfect
                product for you!
              </span>
            </div>
            <div className="information-card">
              <div className="information-card-image">
                <BiAnalyse color="white" size="150" />
              </div>
              <h3>Ingredients breakdown</h3>
              <span>
                Our huge database of ingredients can breakdown the product your
                considering!
              </span>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
