import { Link } from "react-router-dom";

import "./styles.scss";

const Button = ({ link, children, onClick, ...styles }) => {
  return link === "" ? (
    <div className="button" style={styles} onClick={onClick}>
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
