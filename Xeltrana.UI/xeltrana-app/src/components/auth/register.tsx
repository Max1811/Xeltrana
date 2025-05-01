import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import styles from "./login.module.css"; // Shared with Login
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice";

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmitRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = event.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement)
      ?.value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      ?.value;
    const confirmPassword = (
      form.elements.namedItem("confirmPassword") as HTMLInputElement
    )?.value;

    if (!username || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post<{ token: string }>(
        "/authorization/register",
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

      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={onSubmitRegister}>
        <h2 className={styles.title}>Create a new account</h2>

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

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          className={styles.input}
          disabled={loading}
        />

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.registerPrompt}>
          <span>Back to the </span>
          <a href="/login">Log In</a>
        </div>
      </form>
    </div>
  );
};

export default Register;
