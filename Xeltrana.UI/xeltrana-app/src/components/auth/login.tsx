import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { login } from "../../redux/slices/authSlice";
import styles from "./login.module.css";
import { useDispatch } from "react-redux";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = event.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement)
      ?.value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      ?.value;

    if (!username || !password) {
      setError("Please enter both username and password.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post<{ token: string }>(
        "/authorization/login",
        {
          username,
          password,
        }
      );

      dispatch(
        login({
          token: response.data.token,
          user: {},
        })
      );

      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={onSubmitLogin}>
        <h2 className={styles.title}>Sign in to your account</h2>

        <input
          name="username"
          type="text"
          placeholder="Username"
          className={styles.input}
          disabled={loading}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className={styles.input}
          disabled={loading}
        />

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.registerPrompt}>
          <span>Haven't registered yet? </span>
          <a href="/register">Sign Up</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
