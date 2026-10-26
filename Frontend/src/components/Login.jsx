import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthProvider";
import AuthLayout from "./AuthLayout";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const submit = async (values) => {
    setServerError("");
    try {
      await login(values);
      toast.success("Welcome back!");
      const from = location.state?.from;
      navigate(from ? `${from.pathname}${from.search || ""}` : "/courses", { replace: true });
    } catch (error) {
      setServerError(error.message);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to browse the full collection."
      footer={<>New to BookStore? <Link to="/signup" className="font-bold text-amber-600">Create an account</Link></>}
    >
      <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
        {serverError && <div role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">{serverError}</div>}
        <label className="block">
          <span className="form-label">Email address</span>
          <input type="email" autoComplete="email" className="input-field" {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" } })} />
          {errors.email && <span className="form-error">{errors.email.message}</span>}
        </label>
        <label className="block">
          <span className="form-label">Password</span>
          <input type="password" autoComplete="current-password" className="input-field" {...register("password", { required: "Password is required", minLength: { value: 8, message: "Use at least 8 characters" } })} />
          {errors.password && <span className="form-error">{errors.password.message}</span>}
        </label>
        <button type="submit" disabled={isSubmitting} className="button-primary w-full disabled:opacity-60">
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
}
