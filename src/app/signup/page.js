"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from "../contexts/GlobalContext.jsx";
import Validator from "../contexts/Validator.js"; // Assuming Validator handles signup fields too
import { Input, Button, Switch } from "@nextui-org/react";
import { MoonIcon } from "../components/MoonIcon.jsx";
import { SunIcon } from "../components/SunIcon.jsx";
import { useTheme } from "next-themes";


const initialForm = {
  email: "",
  password: "",
  confirmPassword: "", // Added for signup
  companyName: "", // Optional, but good to have
};

const Signup = () => {
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState("");
  const { isAuthenticated, loading } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push('/invoices'); // Redirect if already authenticated
    }
  }, [isAuthenticated, loading, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Basic validation on change (optional)
    const fieldErrors = Validator({ [e.target.name]: e.target.value }, true); // True for signup specific rules
    setErrors(prevErrors => ({ ...prevErrors, [e.target.name]: fieldErrors[e.target.name] }));
  };

  const handleSumbmit = async (e) => {
    e.preventDefault();
    setServerMsg("");

    // Full form validation
    const validationErrors = Validator(form, true); // True for signup specific rules
    if (form.password !== form.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    try {
      const { confirmPassword, ...signupData } = form; // Exclude confirmPassword from API call
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.ok) {
        setServerMsg("Signup successful! Redirecting to login...");
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setServerMsg(data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup API error:', error);
      setServerMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (loading || isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between m-5 text-2xl text-center">
        Sign Up
        <Switch
          defaultSelected={theme === 'dark'}
          size="lg"
          color="primary"
          thumbIcon={({ isSelected, className }) =>
            !isSelected ? (
              <SunIcon className={className} />
            ) : (
              <MoonIcon className={className} />
            )
          }
          onValueChange={(isSelected) => setTheme(isSelected ? 'dark' : 'light')}
        />
      </div>
      <div className="flex items-center justify-center align-middle min-h-[80vh] py-10">
        <form onSubmit={handleSumbmit} className="flex flex-col items-center justify-center w-full max-w-md p-5">
          <Input
            type="email"
            label="Email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
            errorMessage={errors.email}
            isRequired
            variant="underlined"
            className="m-3 w-full"
          />
          <Input
            type="text"
            label="Company Name (Optional)"
            name="companyName"
            id="companyName"
            value={form.companyName}
            onChange={handleChange}
            isInvalid={!!errors.companyName}
            errorMessage={errors.companyName}
            variant="underlined"
            className="m-3 w-full"
          />
          <Input
            type="password"
            label="Password"
            name="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
            errorMessage={errors.password}
            isRequired
            variant="underlined"
            className="m-3 w-full"
          />
          <Input
            type="password"
            label="Confirm Password"
            name="confirmPassword"
            id="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            isInvalid={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword}
            isRequired
            variant="underlined"
            className="m-3 w-full"
          />
          <Button
            type="submit"
            className="flex w-full m-2"
            color="primary"
            variant="shadow"
            isLoading={isLoading}
          >
            Sign Up
          </Button>
          {serverMsg && <div className={`p-2 m-2 text-center ${serverMsg.includes("successful") ? "text-green-500" : "text-red-500"}`}>{serverMsg}</div>}
          <div className="mt-4">
            Already have an account? <Link href="/login" className="text-primary hover:underline">Login</Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Signup;
