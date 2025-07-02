import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthForm from "../components/forms/AuthForm";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("/login", form);
      const { access_token, user } = response.data; 
      localStorage.setItem("token", access_token);
      localStorage.setItem("usuarioId", user.id); 
      onLogin(access_token, user.id); 
      navigate("/");
    } catch (err) {
      setError("Email ou senha inválidos.");
    }
  };

  return (
    <AuthForm
      title="Login"
      error={error}
      onSubmit={handleSubmit}
      linkDescription="Não tem uma conta?"
      linkText="Cadastre-se"
      linkHref="/register"
    >
      <Input
        label="Email"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <Input
        label="Senha"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <Button type="submit" variant="primary">
        Entrar
      </Button>
    </AuthForm>
  );
};

export default Login;