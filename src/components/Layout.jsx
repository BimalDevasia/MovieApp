import React, { useState, useEffect } from 'react';
import SideBar from './SideBar';
import { Outlet } from 'react-router-dom';
import { MdMenu } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';

function Layout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Resize listener to update `isMobile`
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <div className="flex flex-col md:flex-row h-svh w-full overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center h-14 bg-gray-700 px-4 w-full">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          className="p-2 rounded-md"
        >
          <MdMenu className="w-6 h-6 text-white" />
        </motion.button>
        <h1 className="text-xl text-white ml-4">Movie App</h1>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(showSidebar || !isMobile) && (
          <motion.div
            initial={isMobile ? { x: -300 } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -300 } : {}}
            transition={{ duration: 0.3 }}
            className={isMobile 
              ? "absolute z-30 h-[calc(100vh-3.5rem)] top-14" 
              : "h-full flex-shrink-0"
            }
          >
            <SideBar onCloseMobile={() => setShowSidebar(false)} isMobile={isMobile} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay on mobile */}
      {isMobile && showSidebar && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-20"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-2 sm:p-4 overflow-auto h-[calc(100vh-3.5rem)] md:h-svh">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
