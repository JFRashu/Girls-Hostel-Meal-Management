import React from 'react';
import { Home, LogIn, User, Salad, Utensils } from 'lucide-react';

export const RNavBar = () => {
  return (
    <div className="bg-blue-200 p-3 rounded-lg flex justify-between items-center mb-0">
      <Home className="w-6 h-6" />
      <div className="flex items-center gap-2">
      <Utensils className="w-4 h-5"/>
      <div className="font-semibold">Meal Management </div>
        <Salad className="w-4 h-5" />
        
      </div>
      <div className="flex gap-2">
        <LogIn className="w-6 h-6" />
        <User className="w-6 h-6" />
      </div>
    </div>
  );
};

export default RNavBar;