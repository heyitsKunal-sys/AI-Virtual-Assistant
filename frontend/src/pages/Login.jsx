import React from "react";
import {
  HiOutlineSparkles,
  HiOutlineMicrophone,
} from "react-icons/hi";
import {
  HiOutlineBolt,
  HiOutlineCodeBracket,
} from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import axios from "axios";
import { ServerUrl } from "../App";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Logo from "../components/Logo";

function Login({ setUser }) {
  const navigate = useNavigate();

  const FEATURES = [
    {
      icon: <HiOutlineMicrophone />,
      title: "Natural Voice AI",
      desc: "Talk naturally with your website visitors.",
    },
    {
      icon: <HiOutlineSparkles />,
      title: "Smart Navigation",
      desc: "Guide users to exactly where they need to go.",
    },
    {
      icon: <HiOutlineCodeBracket />,
      title: "One-Line Install",
      desc: "Add your AI assistant with a single script.",
    },
    {
      icon: <HiOutlineBolt />,
      title: "Instant Answers",
      desc: "Fast responses powered by Gemini AI.",
    },
  ];

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, email } = result.user;

      const res = await axios.post(
        ServerUrl + "/api/auth/google",
        { name: displayName, email },
        { withCredentials: true }
      );

      setUser(res.data);
      toast.success("Login Successfully");
      navigate("/");
    } catch (error) {
      toast.error("Login Failed...");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#292722] overflow-hidden relative">

      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0 pointer-events-none">

        {/* Warm ambient glow */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#D97757]/10 blur-[140px]" />

        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-[#C96442]/10 blur-[150px]" />

        <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full bg-[#E6A27C]/10 blur-[140px]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(41,39,34,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(41,39,34,0.6) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ================= NAVBAR ================= */}

      <header className="relative z-20 flex items-center justify-between px-6 sm:px-10 lg:px-16 py-7">

        <Logo />

        <div className="hidden sm:flex items-center gap-3 text-sm text-[#78746C]">
          <span className="w-2 h-2 rounded-full bg-[#5B8C65]" />
          AI assistant platform
        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="relative z-10 min-h-[calc(100vh-100px)] flex items-center px-6 sm:px-10 lg:px-16 pb-12">

        <div className="w-full max-w-7xl mx-auto">

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 xl:gap-24 items-center">

            {/* ================= LEFT ================= */}

            <section className="max-w-2xl">

              {/* Badge */}

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D8D1C7] bg-white/60 backdrop-blur-xl text-sm text-[#655F56] mb-7">

                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#D97757]">
                  <HiOutlineSparkles className="text-xs text-white" />
                </span>

                Built for modern websites

              </div>

              {/* Heading */}

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-[-0.04em] leading-[0.98] text-[#292722]">

                Your website.

                <br />

                <span className="text-[#C85D3F]">
                  Now it can talk.
                </span>

              </h1>

              {/* Description */}

              <p className="mt-7 text-base sm:text-lg leading-8 text-[#746F67] max-w-xl">
                Deploy an AI voice assistant that understands your business,
                answers questions, and guides visitors through your website
                in real time.
              </p>

              {/* Feature grid */}

              <div className="grid sm:grid-cols-2 gap-3 mt-10">

                {FEATURES.map(({ icon, title, desc }, index) => (
                  <div
                    key={index}
                    className="
                      group
                      flex gap-4
                      p-4
                      rounded-2xl
                      border border-[#DDD7CE]
                      bg-white/55
                      backdrop-blur-xl
                      hover:bg-white/80
                      hover:border-[#D1B5A6]
                      transition-all duration-300
                    "
                  >

                    <div
                      className="
                        shrink-0
                        w-11 h-11
                        rounded-xl
                        flex items-center justify-center
                        bg-[#E8D8CF]
                        text-[#B95337]
                        text-xl
                        group-hover:bg-[#D97757]
                        group-hover:text-white
                        group-hover:scale-105
                        transition-all duration-300
                      "
                    >
                      {icon}
                    </div>

                    <div>

                      <h3 className="text-sm font-semibold text-[#302E29]">
                        {title}
                      </h3>

                      <p className="text-xs text-[#817B72] mt-1 leading-5">
                        {desc}
                      </p>

                    </div>

                  </div>
                ))}

              </div>

              {/* Bottom trust text */}

              <div className="flex items-center gap-6 mt-9 text-xs text-[#817B72]">

                <div className="flex items-center gap-2">
                  <span className="text-[#5B8C65]">✓</span>
                  No credit card required
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#5B8C65]">✓</span>
                  200 AI responses
                </div>

              </div>

            </section>

            {/* ================= RIGHT LOGIN CARD ================= */}

            <section className="relative">

              {/* Warm glow */}

              <div className="absolute -inset-4 bg-[#D97757]/10 blur-3xl rounded-[40px]" />

              <div
                className="
                  relative
                  rounded-[32px]
                  border border-[#DDD7CE]
                  bg-[#FFFCF7]/95
                  backdrop-blur-2xl
                  p-7 sm:p-9
                  shadow-[0_30px_80px_rgba(72,58,45,0.12)]
                "
              >

                {/* Top indicator */}

                <div className="flex items-center justify-between mb-9">

                  <div>

                    <p className="text-xs uppercase tracking-[0.2em] text-[#918A80]">
                      Welcome back
                    </p>

                    <h2 className="text-2xl font-bold mt-2 text-[#292722]">
                      Sign in to ChatPlug
                    </h2>

                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#D97757] flex items-center justify-center shadow-lg shadow-[#D97757]/20">
                    <HiOutlineSparkles className="text-xl text-white" />
                  </div>

                </div>

                {/* Voice preview */}

                <div className="rounded-2xl border border-[#E2DCD3] bg-[#F5F1EA] p-5 mb-7">

                  <div className="flex items-center gap-3 mb-5">

                    <div className="relative">

                      <div className="w-11 h-11 rounded-full bg-[#D97757] flex items-center justify-center shadow-md shadow-[#D97757]/20">
                        <HiOutlineMicrophone className="text-xl text-white" />
                      </div>

                      <span className="absolute -right-1 -bottom-1 w-3 h-3 rounded-full bg-[#5B8C65] border-2 border-[#F5F1EA]" />

                    </div>

                    <div>

                      <p className="text-sm font-semibold text-[#34312C]">
                        ChatPlug Assistant
                      </p>

                      <p className="text-xs text-[#5B8C65] mt-0.5">
                        Ready to talk
                      </p>

                    </div>

                  </div>

                  {/* Voice waveform */}

                  <div className="flex items-center justify-center gap-1.5 h-10">

                    {[18, 30, 42, 25, 48, 32, 55, 28, 45, 22, 38, 18].map(
                      (height, index) => (
                        <div
                          key={index}
                          className="w-1 rounded-full bg-[#D97757]"
                          style={{ height: `${height}%` }}
                        />
                      )
                    )}

                  </div>

                  <p className="text-center text-xs text-[#918A80] mt-4">
                    Your AI assistant is ready
                  </p>

                </div>

                {/* Google Login */}

                <button
                  onClick={handleLogin}
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    flex items-center justify-center gap-3
                    bg-[#292722]
                    text-white
                    font-semibold
                    text-sm
                    hover:bg-[#3A3731]
                    active:scale-[0.98]
                    transition-all duration-200
                    shadow-[0_10px_30px_rgba(41,39,34,0.18)]
                  "
                >

                  <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                    <FcGoogle className="text-2xl" />
                  </span>

                  Continue with Google

                </button>

                {/* Divider */}

                <div className="flex items-center gap-4 my-7">

                  <div className="h-px flex-1 bg-[#E3DDD4]" />

                  <span className="text-[11px] text-[#9B948A] uppercase tracking-widest">
                    secure login
                  </span>

                  <div className="h-px flex-1 bg-[#E3DDD4]" />

                </div>

                {/* Bottom info */}

                <div className="text-center">

                  <p className="text-xs text-[#918A80] leading-5">
                    By continuing, you agree to use ChatPlug's
                    AI-powered assistant platform.
                  </p>

                  <div className="flex items-center justify-center gap-2 mt-5 text-xs text-[#9B948A]">
                    <span>🔒</span>
                    Secure authentication
                  </div>

                </div>

              </div>

            </section>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Login;