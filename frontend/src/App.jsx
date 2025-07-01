import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TopicForm from "./pages/TopicForm";
import TopicDetails from "./pages/TopicDetails";

axios.defaults.baseURL = "http://127.0.0.1:8000/api";
axios.defaults.headers.post["Content-Type"] = "application/json";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loggedInUserId, setLoggedInUserId] = useState(
    localStorage.getItem("usuarioId")
  );

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          console.log(
            "Requisição 401 Unauthorized detectada. Limpando token e redirecionando para login."
          );
          localStorage.removeItem("token");
          localStorage.removeItem("usuarioId");
          setToken(null);
          setLoggedInUserId(null);
          window.location.href = "/login"; 
        }
        return Promise.reject(error); 
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []); 

  const handleLogin = (newToken, userId) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("usuarioId", userId);
    setToken(newToken);
    setLoggedInUserId(userId);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
     
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("usuarioId");
      setToken(null);
      setLoggedInUserId(null);
      window.location.href = "/login"; 
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            token ? (
              <Dashboard
                token={token}
                onLogout={handleLogout}
                loggedInUserId={loggedInUserId}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/topics/new"
          element={
            token ? <TopicForm token={token} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/topics/:id"
          element={
            token ? (
              <TopicDetails token={token} loggedInUserId={loggedInUserId} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/topics/:id/edit"
          element={
            token ? <TopicForm token={token} /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;