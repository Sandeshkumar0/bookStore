import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthProvider";
import { ApiError } from "../lib/api";
import AuthLayout from "./AuthLayout";

interface SignupFields { fullname: string; email: string; password: string }

export default function Signup() {
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFields>();

  if (user) return <Navigate to="/courses" replace />;

  const submit = handleSubmit(async (values) => {
    setServerError("");
    try {
      const reader = await signup(values);
      toast.success(`Your shelf is ready, ${reader.fullname.split(" ")[0]}`);
      navigate("/courses", { replace: true });
    } catch (reason) {
      setServerError(reason instanceof ApiError ? reason.message : "Your profile could not be created.");
    }
  });

  return (
    <AuthLayout mode="signup">
      <div className="auth-form-heading">
        <span>New reader</span>
        <h2>Create a profile.</h2>
        <p>Three details. No noise. Your private shelf starts here.</p>
      </div>
      <form className="auth-form" onSubmit={submit} noValidate>
        {serverError && <div className="form-banner" role="alert">{serverError}</div>}
        <label>
          <span>Full name</span>
          <input autoComplete="name" aria-invalid={Boolean(errors.fullname)} {...register("fullname", { required: "Name is required", minLength: { value: 2, message: "Use at least 2 characters" } })} />
          {errors.fullname && <small>{errors.fullname.message}</small>}
        </label>
        <label>
          <span>Email address</span>
          <input type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" } })} />
          {errors.email && <small>{errors.email.message}</small>}
        </label>
        <label>
          <span>Password</span>
          <input type="password" autoComplete="new-password" aria-invalid={Boolean(errors.password)} {...register("password", { required: "Password is required", minLength: { value: 8, message: "Use at least 8 characters" }, maxLength: { value: 72, message: "Keep it under 72 characters" } })} />
          {errors.password && <small>{errors.password.message}</small>}
        </label>
        <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Cataloguing profile…" : "Create reader profile"}<span>↗</span></button>
      </form>
      <p className="auth-switch">Already a member? <Link to="/login">Sign in</Link></p>
      <Link to="/" className="auth-return">← Return to the public shelf</Link>
    </AuthLayout>
  );
}
