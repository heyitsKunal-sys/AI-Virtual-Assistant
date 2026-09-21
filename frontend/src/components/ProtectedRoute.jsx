
import React from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({user, loading, children}) {
    if(loading){
  return (
    <div className='min-h-screen flex items-center justify-center brand-surface'>
        <div className='w-9 h-9 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin'/>

    </div>
  )
}

if(!user) return <Navigate to="/login" replace/>

return children;
}


export default ProtectedRoute
