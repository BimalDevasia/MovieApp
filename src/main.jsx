import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter,Routes,Route,Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Layout from './components/Layout.jsx'
import MovieList from './components/MovieList.jsx'
import FavMovie from './components/FavMovie.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
           <Route index element={<Navigate to="/movielist" replace />}/>
          <Route path='/movielist' element={<MovieList/>}/>
          <Route path='/favorites' element={<FavMovie />}/>
        </Route>
      </Routes>
    </BrowserRouter>
   
  </StrictMode>
)
