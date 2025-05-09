import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdMenu, MdClose } from "react-icons/md";
import { MdHome, MdFavorite } from "react-icons/md";
import { Link } from 'react-router-dom';

const MenuItem = memo(({ icon, name, path, isCollapsed }) => (
  <Link 
    to={path}
    className={`
      flex items-center rounded-lg p-2 text-base font-medium transition-all
      hover:bg-gray-700
      ${isCollapsed ? 'justify-center' : 'justify-start'}
    `}
  >
    <div className={`${isCollapsed ? 'text-2xl' : 'text-xl mr-4'}`}>
      {icon}
    </div>
    {!isCollapsed && <span className="whitespace-nowrap">{name}</span>}
  </Link>
));

function SideBar({ onCloseMobile = () => {}, isMobile = false }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: 'Home', icon: <MdHome />, path: '/' },
    { name: 'Favorites', icon: <MdFavorite />, path: '/favorites' },
  ];

  useEffect(() => {
    if (isMobile) setIsCollapsed(true);
  }, [isMobile]);

  const toggleSidebar = () => {
    // If it's mobile and user wants to close, notify parent
    if (isMobile && !isCollapsed) {
      onCloseMobile(); // triggers Layout to hide sidebar completely
    } else {
      setIsCollapsed(prev => !prev);
    }
  };

  const sidebarWidth = isCollapsed 
    ? 'w-12 sm:w-16'
    : 'w-64 sm:w-72 lg:w-80';

  return (
    <div className={`h-svh bg-gray-800 text-white flex flex-col transition-all duration-300 ease-in-out ${sidebarWidth}`}>
      <header className='relative border-b border-gray-700 pb-2'>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div 
              key="title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-16 overflow-hidden"
            >
              <h1 className='flex justify-center py-5 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold'>
                Movie App
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          className='absolute right-2 sm:right-3 top-4 sm:top-5 cursor-pointer 
                    bg-gray-700 rounded-full p-1 hover:bg-gray-600 active:scale-95
                    transition-transform duration-150'
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            isMobile ? "": <MdKeyboardArrowRight className='h-6 w-6 sm:h-8 sm:w-8' />
          ) : (
            isMobile ? <MdClose className='h-6 w-6 sm:h-8 sm:w-8' /> : <MdKeyboardArrowLeft className='h-6 w-6 sm:h-8 sm:w-8' />
          )}
        </button>
      </header>

      <nav className='flex-1 mt-4 overflow-y-auto'>
        <ul className={`space-y-2 px-2 ${isCollapsed ? 'mt-14':""}`}>
          {menuItems.map((item, index) => (
            <li key={index}>
              <MenuItem 
                icon={item.icon}
                name={item.name}
                path={item.path}
                isCollapsed={isCollapsed}
              />
            </li>
          ))}
        </ul>
      </nav>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div 
            key="footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-auto border-t border-gray-700 p-4"
          >
            <div className="text-sm text-gray-400">
              <p>© 2025 Movie App</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SideBar;
