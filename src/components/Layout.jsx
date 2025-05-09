import React from 'react'
import SideBar from './SideBar'
import { Outlet } from 'react-router-dom'

function Layout() {
    
  return (
    <div className='flex max-h-svh h-svh max-w-svw overflow-hidden'>
        <SideBar/>
        <main className='flex-1 p-4'>
            <Outlet/>
        </main>
    </div>
  )
}

export default Layout