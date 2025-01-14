import React from 'react';

import { Outlet } from 'react-router-dom';
import Footer from '../Components/Footer';
import { RNavBar } from '../Components/Rashu/RNavBar';

const Layout = () => {
  return (
   <>
         {/* Navbar (self-closing tag) */}
         <RNavBar />
      {/* Outlet (self-closing tag) */}
      <Outlet/>
      <Footer />
   </>

 
  );
};

export default Layout;
