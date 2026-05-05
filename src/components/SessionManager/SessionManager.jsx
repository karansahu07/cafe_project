import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SessionManager = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // Check if token exists in localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");

    // If token doesn't exist, redirect to login page
    if (!token) {
      navigate("/login"); // Redirect to login page if no token
    }
  }, [navigate]); // Empty dependency array ensures this runs once when the component mounts

  return null; // This component doesn't render anything
};

export default SessionManager;
