import { Navigate } from "react-router-dom";

/**
 * Index page — redirects to the Breathwork Session: Activate screen
 * Route: /breathwork-session-activate (Screen 1 of 3)
 */
const Index = () => {
  return <Navigate to="/breathwork-session-activate" replace />;
};

export default Index;
