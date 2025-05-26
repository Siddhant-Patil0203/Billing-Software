"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; // Added missing import
// import Loader from "../components/Loader";
import Validator from "../contexts/Validator.js";
import Link from 'next/link'
// import axios from "../axios.js";
import { useGlobalContext } from "../contexts/GlobalContext.jsx";
import { useTheme } from "next-themes";
import { Switch, Input, Button } from "@nextui-org/react";
import { MoonIcon } from "../components/MoonIcon.jsx";
import { SunIcon } from "../components/SunIcon.jsx";
import { ImGoogle } from "react-icons/im";

const initialForm = {
  email: "",
  password: "",
};

const Login = () => {
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState("");
  const { login, isAuthenticated, loading } = useGlobalContext(); // Use login from context
  // const { theme, setTheme } = useTheme(); // This line is the duplicate, removed. The one on line 20 is kept.
  const router = useRouter(); // For navigation (already imported in GlobalContext)

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push('/invoices'); // Redirect if already authenticated
    }
  }, [isAuthenticated, loading, router]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    const validationErrors = Validator({
      ...form,
      [e.target.name]: e.target.value,
    });
    setErrors(validationErrors);
  };

  const handleSumbmit = async (e) => {
    e.preventDefault();
    setServerMsg(""); // Clear previous server messages
    const validationErrors = Validator(form);
    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token); // Use context login function
        // Redirect is handled by the login function or useEffect
      } else {
        setServerMsg(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login API error:', error);
      setServerMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-in can be re-implemented later if needed
  const googleSignin = async (e) => {
    e.preventDefault();
    setServerMsg("Google Sign-in is not implemented yet.");
    // setIsLoading(true);
    // Potentially redirect to /api/auth/google if that's a backend route
  };

  if (loading || isAuthenticated) {
    // Show loader while checking auth or if already authenticated (will redirect)
    return (
      <div className="flex items-center justify-center h-screen">
        {/* Replace with a proper Loader component if available */}
        <div>Loading...</div> 
      </div>
    );
  }
  
  //Google Auth Redirect
  // const queryParams = new URLSearchParams(window.location.search);
  // const token = queryParams.get("token");
  // const userResult = queryParams.get("result");
  // console.log(token, userResult);
  // if (token && userResult) {
  // useEffect(() => {
  // setIsLoading(true);
  // const userG = {};
  // userG.result = JSON.parse(userResult); // Parse the userResult JSON string into an object
  // userG.token = token;
  // localStorage.setItem("user", JSON.stringify(userG));
  // setUser(JSON.parse(localStorage.getItem("user")));

  // setIsLoading(false);
  // navigateTo("/");
  // }, []);
  // }

  return (
    <>
      {/* {isLoading ? <Loader width="500px" height="250px" /> : null} */}
      <div className="flex items-center justify-between m-5 text-2xl text-center">
        Login
        <Switch
          defaultSelected
          size="lg"
          color="primary"
          thumbIcon={({ isSelected, className }) =>
            !isSelected ? (
              <SunIcon className={className} />
            ) : (
              <MoonIcon className={className} />
            )
          }
          onClick={() => {
            if (theme === "light") {
              setTheme("dark");
            } else if (theme === "dark") {
              setTheme("light");
            }
          }}
        />
      </div>
      <div className="flex items-center justify-center align-middle h-[80vh]">
        <form onSubmit={handleSumbmit} className="flex flex-col items-center justify-center">
          <Input
            type="email"
            label="Email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            isInvalid={!!errors.email} // Changed here
            isRequired
            variant="underlined"
            className="m-3 w-[300px]"
          />
          {errors.email && (
            <div className="m-2 text-red-500">{errors.email}</div>
          )}
          <Input
            type="password"
            label="Password"
            name="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            isInvalid={!!errors.password} // Changed here
            isRequired
            variant="underlined"
            className="m-3 w-[300px]"
          />
          {errors.password && (
            <div className="p-1 m-2 text-red-500">{errors.password}</div>
          )}
          <Button
            type="submit"
            className="flex w-full m-2"
            color="primary"
            variant="shadow"
            isLoading={isLoading}
          >
            Sign in
          </Button>
          <div>or</div>
          <Button
            onClick={googleSignin}
            className="flex w-full m-2"
            color="primary"
            variant="shadow"
            isLoading={isLoading}
            startContent={<ImGoogle />}
          >
            Sign in with Google
          </Button>
          {serverMsg && <div className="p-1 m-2 text-red-500">{serverMsg}</div>}
          <div><Link href="/signup">Register?</Link></div>
        </form>
      </div>
    </>
  );
};

export default Login;
