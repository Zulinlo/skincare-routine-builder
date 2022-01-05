import { Link } from "react-router-dom";

import "./styles.scss";

const Button = ({ link, children, ...styles }) => {
  return link === "" ? (
    <div className="button" style={styles}>
      {children}
    </div>
  ) : (
    <Link to={link} className="button" style={styles}>
      {children}
    </Link>
  );
};

Button.defaultProps = {
  link: "",
};

export default Button;
