import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "contexts/AuthContext";
import PrivateRoute from "components/PrivateRoute";

import Home from "pages/Home";
import Register from "pages/Register";
import Login from "pages/Login";
import ForgotPassword from "pages/Login/ForgotPassword";
import RoutineBuilder from "pages/RoutineBuilder";

import "./styles.scss";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/routine-builder" element={
            <PrivateRoute>
              <RoutineBuilder />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
