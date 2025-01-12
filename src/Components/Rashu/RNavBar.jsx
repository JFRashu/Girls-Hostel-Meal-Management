import React from 'react'
import { Home, LogIn, User } from 'lucide-react';
export const RNavBar = () => {
  return (
    <div className="bg-blue-200 p-3 rounded-lg flex justify-between items-center mb-0">
        <Home className="w-6 h-6" />
        <div className="font-semibold">🍽️ Meal Management 🏠</div>
        <div className="flex gap-2">
          <LogIn className="w-6 h-6" />
          <User className="w-6 h-6" />
        </div>
      </div>
  )
}
