"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Field, FieldGroup, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Blocks, Eye, EyeOff, Loader2, Lock, Mail, User, UserCheck } from "lucide-react";
import Link from "next/link";

type AuthMode = "signin" | "signup";

interface AuthFormData {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  emailOrUsername?: string;
}

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormData>({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      emailOrUsername: "",
    },
  });

  const handleToggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    reset();
  };

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);

    if (mode === "signin") {
      // Handle Sign In
      try {
        const res = await signIn("credentials", {
          emailOrUsername: data.emailOrUsername,
          password: data.password,
          redirect: false,
        });

        if (res?.error) {
          toast.add({
            title: "Login Failed",
            description: res.error || "Invalid username/email or password.",
            type: "error",
          });
        } else {
          toast.add({
            title: "Success",
            description: "Logged in successfully!",
            type: "success",
          });
          router.push("/");
          router.refresh();
        }
      } catch (err: any) {
        console.error(err);
        toast.add({
          title: "Error",
          description: "An unexpected error occurred.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Handle Sign Up
      try {
        const registerRes = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            username: data.username,
            email: data.email,
            password: data.password,
          }),
        });

        const registerData = await registerRes.json();

        if (!registerRes.ok) {
          toast.add({
            title: "Registration Failed",
            description: registerData.error || "Failed to create account.",
            type: "error",
          });
          setLoading(false);
          return;
        }

        toast.add({
          title: "Success",
          description: "Account created! Signing you in...",
          type: "success",
        });

        // Auto login after registration
        const loginRes = await signIn("credentials", {
          emailOrUsername: data.email,
          password: data.password,
          redirect: false,
        });

        if (loginRes?.error) {
          toast.add({
            title: "Notice",
            description: "Account created successfully. Please sign in.",
            type: "info",
          });
          setMode("signin");
          reset({
            emailOrUsername: data.email,
            password: "",
          });
        } else {
          router.push("/");
          router.refresh();
        }
      } catch (err: any) {
        console.error(err);
        toast.add({
          title: "Error",
          description: "An unexpected error occurred.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-radial from-gray-900 via-gray-950 to-black px-4 py-12 sm:px-6 lg:px-8">
      {/* Ambient background blur blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-gray-900/50 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-8 shadow-2xl space-y-8">
        {/* Header Logo */}
        <div className="text-center">
          <div className="inline-flex bg-linear-to-br from-blue-900/50 to-purple-900/50 p-3 rounded-2xl border border-gray-800 shadow-inner mb-4">
            <Blocks className="size-8 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {mode === "signin"
              ? "Sign in to access your saved snippets & settings"
              : "Get started with CodeCraft interactive editor"}
          </p>
        </div>

        {/* Auth form using react-hook-form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FieldGroup className="space-y-4">
            {mode === "signup" && (
              <>
                {/* Full Name */}
                <Field>
                  <Label className="text-xs font-semibold text-gray-400" htmlFor="name">
                    Full Name
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 z-10">
                      <User className="size-4" />
                    </span>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10 pr-4 py-2.5 rounded-lg bg-gray-950/80 border border-gray-800 text-gray-200 placeholder-gray-600 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                      {...register("name", { required: "Full name is required" })}
                    />
                  </div>
                  {errors.name && (
                    <FieldError className="text-xs text-red-400 mt-1">
                      {errors.name.message}
                    </FieldError>
                  )}
                </Field>

                {/* Username */}
                <Field>
                  <Label className="text-xs font-semibold text-gray-400" htmlFor="username">
                    Username
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 z-10">
                      <UserCheck className="size-4" />
                    </span>
                    <Input
                      id="username"
                      type="text"
                      placeholder="johndoe"
                      className="pl-10 pr-4 py-2.5 rounded-lg bg-gray-950/80 border border-gray-800 text-gray-200 placeholder-gray-600 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                      {...register("username", {
                        required: "Username is required",
                        pattern: {
                          value: /^[a-zA-Z0-9_-]+$/,
                          message: "Username must be alphanumeric (can contain hyphens/underscores)",
                        },
                      })}
                    />
                  </div>
                  {errors.username && (
                    <FieldError className="text-xs text-red-400 mt-1">
                      {errors.username.message}
                    </FieldError>
                  )}
                </Field>

                {/* Email */}
                <Field>
                  <Label className="text-xs font-semibold text-gray-400" htmlFor="email">
                    Email Address
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 z-10">
                      <Mail className="size-4" />
                    </span>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="pl-10 pr-4 py-2.5 rounded-lg bg-gray-950/80 border border-gray-800 text-gray-200 placeholder-gray-600 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email format",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <FieldError className="text-xs text-red-400 mt-1">
                      {errors.email.message}
                    </FieldError>
                  )}
                </Field>
              </>
            )}

            {mode === "signin" && (
              /* Email or Username */
              <Field>
                <Label className="text-xs font-semibold text-gray-400" htmlFor="emailOrUsername">
                  Email or Username
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 z-10">
                    <Mail className="size-4" />
                  </span>
                  <Input
                    id="emailOrUsername"
                    type="text"
                    placeholder="email@example.com or username"
                    className="pl-10 pr-4 py-2.5 rounded-lg bg-gray-950/80 border border-gray-800 text-gray-200 placeholder-gray-600 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                    {...register("emailOrUsername", { required: "Email or username is required" })}
                  />
                </div>
                {errors.emailOrUsername && (
                  <FieldError className="text-xs text-red-400 mt-1">
                    {errors.emailOrUsername.message}
                  </FieldError>
                )}
              </Field>
            )}

            {/* Password */}
            <Field>
              <Label className="text-xs font-semibold text-gray-400" htmlFor="password">
                Password
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 z-10">
                  <Lock className="size-4" />
                </span>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 py-2.5 rounded-lg bg-gray-950/80 border border-gray-800 text-gray-200 placeholder-gray-600 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors z-20 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <FieldError className="text-xs text-red-400 mt-1">
                  {errors.password.message}
                </FieldError>
              )}
            </Field>
          </FieldGroup>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-6 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-all mt-6 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : mode === "signin" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        {/* Switch Mode Action */}
        <div className="text-center pt-2">
          <button
            onClick={handleToggleMode}
            className="text-xs font-medium text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors bg-transparent border-0 cursor-pointer"
          >
            {mode === "signin"
              ? "Don't have an account? Create one"
              : "Already have an account? Sign in"}
          </button>
        </div>

        {/* Back to Home link */}
        <div className="text-center text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-400 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
