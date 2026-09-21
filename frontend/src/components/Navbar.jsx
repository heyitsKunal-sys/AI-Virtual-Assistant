import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import axios from 'axios';
import { ServerUrl } from '../App';
import toast from 'react-hot-toast';
import Logo from './Logo';
import { Button } from '../components/ui/button';

function Navbar({ user, setUser }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + "/api/auth/logout", { withCredentials: true })
      setUser(null)
      toast.success("Logout Successfully")
      navigate("/login")
    } catch (error) {
      toast.error("logout failed")
      console.log(error)
    }
  }

  return (
    <div className='sticky top-0 z-50 px-3 sm:px-5 pt-3'>
      <div className='max-w-6xl mx-auto rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.06)] px-4 sm:px-5 py-2.5 flex items-center justify-between'>

        <button onClick={() => navigate("/")} className="cursor-pointer">
          <Logo />
        </button>

        {user && (
          <div className='hidden md:flex items-center gap-2'>
            <Button size="sm" onClick={() => navigate("/builder")}>Builder</Button>
            <Button size="sm" variant="secondary" onClick={() => navigate("/billing")}>Billing</Button>

            <div className='flex items-center gap-2 pl-3 pr-1.5 py-1.5 ml-1 rounded-xl bg-slate-50 border border-slate-200'>
              <div className='w-8 h-8 rounded-full brand-gradient flex items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-500/30'>
                <span className='text-white text-sm font-bold'>
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className='max-w-[140px]'>
                <p className='text-sm font-semibold text-slate-800 truncate leading-tight'>{user.name}</p>
                <p className='text-xs text-slate-400 truncate leading-tight'>{user.email}</p>
              </div>
              <button onClick={handleLogout} className='ml-1 p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer'>
                <FiLogOut size={16} />
              </button>
            </div>
          </div>
        )}

        {user && (
          <button onClick={() => setMenuOpen(!menuOpen)} className='md:hidden p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors'>
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        )}

      </div>

      {menuOpen && (
        <div className='md:hidden max-w-6xl mx-auto mt-2'>
          <div className='bg-white rounded-2xl border border-slate-200 shadow-lg p-4'>
            <div className='flex items-center gap-3 pb-4 border-b border-slate-100'>
              <div className='w-9 h-9 rounded-full brand-gradient flex items-center justify-center flex-shrink-0'>
                <span className='text-white text-sm font-bold'>
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className='flex-1 overflow-hidden'>
                <p className='text-sm font-semibold text-slate-800 truncate'>{user.name}</p>
                <p className='text-xs text-slate-400 truncate'>{user.email}</p>
              </div>
            </div>

            <div className='flex flex-col gap-3 mt-4'>
              <Button className="w-full" onClick={() => { navigate("/builder"); setMenuOpen(false) }}>Builder</Button>
              <Button className="w-full" variant="secondary" onClick={() => { navigate("/billing"); setMenuOpen(false) }}>Billing</Button>
            </div>

            <button onClick={() => { setMenuOpen(false); handleLogout() }} className='mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors text-sm font-medium cursor-pointer'>
              <FiLogOut size={16} /> Log Out
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default Navbar
