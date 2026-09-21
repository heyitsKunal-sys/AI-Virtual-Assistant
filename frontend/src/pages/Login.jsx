import React from 'react'
import { HiOutlineSparkles, HiOutlineMicrophone } from "react-icons/hi";
import { HiOutlineBolt, HiOutlineCodeBracket } from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from "axios"
import { ServerUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import Logo from '../Components/Logo';

function Login({ setUser }) {
  const navigate = useNavigate()
  const FEATURES = [
    {
      icon: <HiOutlineMicrophone />,
      title: "Natural Voice AI",
      desc: "Real conversations, not a scripted chatbot.",
    },
    {
      icon: <HiOutlineSparkles />,
      title: "Guided Navigation",
      desc: "Walks visitors to the right page on command.",
    },
    {
      icon: <HiOutlineCodeBracket />,
      title: "One-Line Install",
      desc: "A single script tag — no dev sprint needed.",
    },
    {
      icon: <HiOutlineBolt />,
      title: "Instant Answers",
      desc: "Powered by Gemini for fast, accurate replies.",
    },
  ];

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      const { displayName, email } = result.user
      const res = await axios.post(ServerUrl + "/api/auth/google", { name: displayName, email }, { withCredentials: true })
      setUser(res.data)
      toast.success("Login Successfully")
      navigate("/")
    } catch (error) {
      toast.error("Login Failed...")
      console.log(error)
    }
  }

  return (
    <div className='min-h-screen bg-white overflow-hidden'>
      <div className='grid lg:grid-cols-2 min-h-screen'>

        {/* left — sign in */}
        <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-16">
          <div className="mb-10">
            <Logo />
          </div>

          <Badge className="w-fit">
            <HiOutlineSparkles />
            Built for modern teams
          </Badge>

          <h1 className='mt-7 text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] text-slate-900'>
            Deploy a voice assistant
            <span className='block brand-gradient-text'>in minutes, not weeks</span>
          </h1>

          <p className='mt-7 text-base sm:text-lg text-slate-500 leading-8 max-w-lg'>
            Give visitors a real-time voice guide that understands your business,
            speaks in your tone, and helps them find what they need — live on
            your site today.
          </p>

          <Button size="lg" onClick={handleLogin} className="mt-10 w-fit">
            <FcGoogle className='text-2xl bg-white rounded-full' />
            Continue with Google
          </Button>

          <p className='mt-4 text-sm text-slate-500'>Free to start — 200 AI responses included.</p>
        </div>

        {/* right — dark feature panel */}
        <div className="relative bg-[#0b0f1e] px-6 sm:px-12 lg:px-16 py-16 flex flex-col justify-center overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full" />

          <div className="relative">
            <h2 className='text-2xl sm:text-3xl font-bold text-white'>Why teams choose ChatPlug</h2>
            <p className="text-slate-400 mt-2 text-sm">Everything you need, nothing you have to build yourself.</p>

            <div className='mt-10 space-y-4'>
              {FEATURES.map(({ icon, title, desc }, index) => (
                <div key={index} className='flex gap-5 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 hover:bg-white/[0.07] transition-colors'>
                  <div className='min-w-[52px] h-[52px] rounded-2xl brand-gradient text-white text-xl flex items-center justify-center shadow-[0_10px_30px_rgba(79,70,229,0.35)]'>
                    {icon}
                  </div>
                  <div>
                    <h3 className='text-white text-base font-semibold'>{title}</h3>
                    <p className='mt-1.5 text-sm leading-6 text-slate-400'>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login
