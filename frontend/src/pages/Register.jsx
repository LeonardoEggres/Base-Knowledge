import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthForm from "../components/forms/AuthForm";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.password_confirmation) {
      setError("As senhas não conferem.");
      return;
    }

    try {
      await axios.post("/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(
          err.response.data.error ||
            err.response.data.message ||
            "Erro ao registrar usuário."
        );
      } else {
        setError("Erro ao registrar usuário.");
      }
    }
  };

  return (
    <AuthForm
      title="Registrar"
      error={error}
      onSubmit={handleSubmit}
      linkDescription="Já tem uma conta?"
      linkText="Faça login"
      linkHref="/login"
    >
      <Input
        label="Nome"
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />
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
        minLength={6}
      />
      <Input
        label="Confirmar Senha"
        type="password"
        name="password_confirmation"
        value={form.password_confirmation}
        onChange={handleChange}
        required
        minLength={6}
      />
      <Button type="submit" variant="success">
        Registrar
      </Button>
    </AuthForm>
  );
};

export default Register;