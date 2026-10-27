import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthProvider";
import { ApiError } from "../lib/api";
import AuthLayout from "./AuthLayout";

interface LoginFields { email: string; password: string }

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFields>();

  if (user) return <Navigate to="/courses" replace />;

  const submit = handleSubmit(async (values) => {
    setServerError("");
    try {
      const reader = await login(values);
      toast.success(`Welcome back, ${reader.fullname.split(" ")[0]}`);
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(from || "/courses", { replace: true });
    } catch (reason) {
      setServerError(reason instanceof ApiError ? reason.message : "The archive could not open your session.");
    }
  });

  return (
    <AuthLayout mode="login">
      <div className="auth-form-heading">
        <span>Member access</span>
        <h2>Welcome back.</h2>
        <p>Enter the details attached to your reader profile.</p>
      </div>
      <form className="auth-form" onSubmit={submit} noValidate>
        {serverError && <div className="form-banner" role="alert">{serverError}</div>}
        <label>
          <span>Email address</span>
          <input type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" } })} />
          {errors.email && <small>{errors.email.message}</small>}
        </label>
        <label>
          <span>Password</span>
          <input type="password" autoComplete="current-password" aria-invalid={Boolean(errors.password)} {...register("password", { required: "Password is required", minLength: { value: 8, message: "Use at least 8 characters" } })} />
          {errors.password && <small>{errors.password.message}</small>}
        </label>
        <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Opening the archive…" : "Enter the archive"}<span>↗</span></button>
      </form>
      <p className="auth-switch">No reader profile yet? <Link to="/signup">Create one</Link></p>
      <Link to="/" className="auth-return">← Return to the public shelf</Link>
    </AuthLayout>
  );
}
