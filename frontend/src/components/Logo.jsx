import React from 'react'
import logo from "../assets/chat-plug-logo.png"
import { cn } from '../lib/utils'

function Logo({ dark = false, className = "" }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="h-9 w-9 rounded-xl brand-gradient flex items-center justify-center shadow-sm shadow-indigo-500/30 overflow-hidden p-1.5">
        <img src={logo} alt="ChatPlug logo" className="h-full w-full object-contain" />
      </div>
      <h1 className={cn('font-bold text-xl leading-none tracking-tight', dark ? 'text-white' : 'text-slate-800')}>
        Chat<span className="brand-gradient-text">Plug</span>
      </h1>
    </div>
  )
}

export default Logo
