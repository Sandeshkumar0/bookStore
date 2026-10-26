import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthProvider";
import AuthLayout from "./AuthLayout";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm();

  const submit = async (values) => {
    setServerError("");
    try {
      await signup(values);
      toast.success("Your account is ready!");
      navigate("/courses", { replace: true });
    } catch (error) {
      if (error.errors) {
        Object.entries(error.errors).forEach(([field, message]) => setError(field, { message }));
      } else {
        setServerError(error.message);
      }
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Save books, build a cart, and explore the complete catalog."
      footer={<>Already have an account? <Link to="/login" className="font-bold text-amber-600">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
        {serverError && <div role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">{serverError}</div>}
        <label className="block">
          <span className="form-label">Full name</span>
          <input type="text" autoComplete="name" className="input-field" {...register("fullname", { required: "Name is required", minLength: { value: 2, message: "Use at least 2 characters" }, maxLength: { value: 80, message: "Keep your name under 80 characters" } })} />
          {errors.fullname && <span className="form-error">{errors.fullname.message}</span>}
        </label>
        <label className="block">
          <span className="form-label">Email address</span>
          <input type="email" autoComplete="email" className="input-field" {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" } })} />
          {errors.email && <span className="form-error">{errors.email.message}</span>}
        </label>
        <label className="block">
          <span className="form-label">Password</span>
          <input type="password" autoComplete="new-password" className="input-field" {...register("password", { required: "Password is required", minLength: { value: 8, message: "Use at least 8 characters" }, maxLength: { value: 72, message: "Use no more than 72 characters" } })} />
          {errors.password && <span className="form-error">{errors.password.message}</span>}
        </label>
        <button type="submit" disabled={isSubmitting} className="button-primary w-full disabled:opacity-60">
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
