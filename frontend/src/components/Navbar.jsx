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

      {/* NAVBAR */}
      <div className='
        max-w-6xl mx-auto
        rounded-2xl
        border border-[#D9D1C6]
        bg-[#F7F4EE]
        px-4 sm:px-5 py-2.5
        flex items-center justify-between
        shadow-[0_8px_30px_rgba(60,48,38,0.10)]
      '>

        {/* LOGO */}
        <button
          onClick={() => navigate("/")}
          className="cursor-pointer"
        >
          <Logo />
        </button>

        {/* DESKTOP */}
        {user && (
          <div className='hidden md:flex items-center gap-2'>

            {/* Builder */}
            <button
              onClick={() => navigate("/builder")}
              className='
                px-4 py-2
                rounded-xl
                bg-[#292722]
                text-white
                text-sm font-medium
                hover:bg-[#3A3731]
                transition-all
                cursor-pointer
              '
            >
              Builder
            </button>

            {/* Billing */}
            <button
              onClick={() => navigate("/billing")}
              className='
                px-4 py-2
                rounded-xl
                bg-[#EAE4DB]
                text-[#4A463F]
                border border-[#D9D1C6]
                text-sm font-medium
                hover:bg-[#DED7CC]
                transition-all
                cursor-pointer
              '
            >
              Billing
            </button>

            {/* USER */}
            <div className='
              flex items-center gap-2
              ml-2
              pl-2 pr-2 py-1.5
              rounded-xl
              bg-[#FFFDF9]
              border border-[#DED7CC]
            '>

              {/* Avatar */}
              <div className='
                w-9 h-9
                rounded-full
                bg-[#D97757]
                flex items-center justify-center
                flex-shrink-0
              '>
                <span className='text-white text-sm font-bold'>
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* User info */}
              <div className='max-w-[140px]'>
                <p className='
                  text-sm font-semibold
                  text-[#292722]
                  truncate leading-tight
                '>
                  {user.name}
                </p>

                <p className='
                  text-xs
                  text-[#8B8379]
                  truncate leading-tight
                '>
                  {user.email}
                </p>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className='
                  ml-1
                  p-2
                  rounded-lg
                  text-[#8B8379]
                  hover:text-[#C85D3F]
                  hover:bg-[#F3E4DD]
                  transition-all
                  cursor-pointer
                '
              >
                <FiLogOut size={16} />
              </button>

            </div>
          </div>
        )}

        {/* MOBILE MENU BUTTON */}
        {user && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className='
              md:hidden
              p-2
              rounded-xl
              text-[#4A463F]
              hover:text-[#C85D3F]
              hover:bg-[#EAE4DB]
              transition-all
              cursor-pointer
            '
          >
            {menuOpen
              ? <FiX size={22} />
              : <FiMenu size={22} />
            }
          </button>
        )}

      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className='md:hidden max-w-6xl mx-auto mt-2'>

          <div className='
            bg-[#F7F4EE]
            rounded-2xl
            border border-[#D9D1C6]
            shadow-[0_12px_35px_rgba(60,48,38,0.12)]
            p-4
          '>

            {/* USER */}
            <div className='
              flex items-center gap-3
              pb-4
              border-b border-[#DED7CC]
            '>

              <div className='
                w-10 h-10
                rounded-full
                bg-[#D97757]
                flex items-center justify-center
                flex-shrink-0
              '>
                <span className='text-white text-sm font-bold'>
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className='flex-1 overflow-hidden'>

                <p className='
                  text-sm font-semibold
                  text-[#292722]
                  truncate
                '>
                  {user.name}
                </p>

                <p className='
                  text-xs
                  text-[#8B8379]
                  truncate
                '>
                  {user.email}
                </p>

              </div>

            </div>

            {/* BUTTONS */}
            <div className='flex flex-col gap-3 mt-4'>

              <button
                className='
                  w-full
                  py-3
                  rounded-xl
                  bg-[#292722]
                  text-white
                  text-sm font-medium
                  hover:bg-[#3A3731]
                  transition-all
                  cursor-pointer
                '
                onClick={() => {
                  navigate("/builder")
                  setMenuOpen(false)
                }}
              >
                Builder
              </button>

              <button
                className='
                  w-full
                  py-3
                  rounded-xl
                  bg-[#EAE4DB]
                  text-[#4A463F]
                  border border-[#D9D1C6]
                  text-sm font-medium
                  hover:bg-[#DED7CC]
                  transition-all
                  cursor-pointer
                '
                onClick={() => {
                  navigate("/billing")
                  setMenuOpen(false)
                }}
              >
                Billing
              </button>

            </div>

            {/* LOGOUT */}
            <button
              onClick={() => {
                setMenuOpen(false)
                handleLogout()
              }}
              className='
                mt-4
                w-full
                flex items-center justify-center gap-2
                py-3
                rounded-xl
                bg-[#F3E4DD]
                text-[#C85D3F]
                hover:bg-[#EBD5CA]
                transition-all
                text-sm font-medium
                cursor-pointer
              '
            >
              <FiLogOut size={16} />
              Log Out
            </button>

          </div>
        </div>
      )}

    </div>
  )
}

export default Navbar