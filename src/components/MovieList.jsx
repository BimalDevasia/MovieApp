import { useState, useEffect, useRef } from 'react';
import { TiHeartFullOutline } from "react-icons/ti";
import axios from 'axios';
const MovieSearch = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('avengers');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [favMovies, setFavMovies] = useState([])

  const carouselContainerRef = useRef(null);
  const API_KEY = import.meta.env.VITE_API_KEY;

  const fetchMovies = async (searchTerm, page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
   
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      if (data.Response === 'False') {
        throw new Error(data.Error || 'Failed to fetch movies');
      }
      
      setMovies(data.Search || []);
      setTotalResults(parseInt(data.totalResults) || 0);
    } catch (err) {
      setError(err.message);
      setMovies([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchMovies(search, currentPage);
  }, [currentPage, search]);


  const totalPages = Math.ceil(totalResults / 10); 

  // Handle search form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchMovies(search, 1);
  };

  // Load more pages
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Carousel navigation functions
  const scrollLeft = () => {
    if (carouselContainerRef.current) {
      const scrollAmount = 220; // Width of card + margin
      const newPosition = Math.max(scrollPosition - scrollAmount, 0);
      carouselContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  const scrollRight = () => {
    if (carouselContainerRef.current) {
      const scrollAmount = 220; // Width of card + margin
      const maxScroll = carouselContainerRef.current.scrollWidth - carouselContainerRef.current.clientWidth;
      const newPosition = Math.min(scrollPosition + scrollAmount, maxScroll);
      carouselContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  const deleteFav = async(movie) =>{
    try{
      const response = await axios.delete(`https://movieappbackend-sqqk.onrender.com/api/favourite/${movie.imdbID}`,{
        headers:{
          'Content-Type':'application/json'
        }
      })
      console.log(response)
    }catch(err){
      console.error(err)
    }
  }

  const handleFavoriteClick = (movie) =>{
    if (favMovies.some(m =>m.imdbID === movie.imdbID)){
      setFavMovies(favMovies.filter(m => m.imdbID !== movie.imdbID));
      deleteFav(movie)
    }
    else{
      storeFav(movie)
      setFavMovies([...favMovies,movie])
    }
  }
  const isFavorite = (movie) =>{
    return favMovies.some(m => m.imdbID === movie.imdbID)
  }

  useEffect(() => {
    const fetchMov = async () =>{
      try{
     
        const response = await fetch('https://movieappbackend-sqqk.onrender.com/api/favourite',{
          method:"GET",
          headers:{
            'Content-Type': 'application/json'
          }
        })
        if(!response.ok){
          throw new Error("Failed to fetch favourite movies")
        }
        console.log(response)       
        const data = await response.json();
        setFavMovies(data);
      }catch(err){
        console.error(err)
      }
    }
    fetchMov()
  },[])





    const storeFav = async (movie) =>{
      if(favMovies.length === 0){
        return;
      }
      try{
      
        const response= await fetch('https://movieappbackend-sqqk.onrender.com/api/favourite',{
          method:"POST",
          headers:{
            'Content-Type': 'application/json'
          },
          body:JSON.stringify(movie)
        })
        if(!response.ok){
          throw new Error("Failed to store favourite")
        }

      }catch(err){
        console.error(err)
      }
    }
    
  


  return (
    <div className="w-full min-h-screen bg-gray-100 px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Movie Search</h1>
      
      <form onSubmit={handleSubmit} className="flex justify-center mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for movies..."
          className="px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </form>
      
      {loading && <p className="text-center text-lg">Loading...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      
      {!loading && !error && (
        <div className="flex flex-col items-center">
          <div className="text-center mb-4">
            <p className="text-gray-600">
              Showing page {currentPage} of {totalPages} ({totalResults} total results)
            </p>
          </div>
          
          
          <div className="relative w-full max-w-4xl mb-8">
            {/* Left Navigation Button */}
            <button 
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/90 transition-colors"
              aria-label="Previous movies"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
           
            <div 
              ref={carouselContainerRef}
              className="flex overflow-x-auto space-x-4 py-4 scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {movies.map(movie => (
                <div 
                  key={movie.imdbID} 
                  className="flex-shrink-0 w-48 bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
                >
                  <div className="h-64 bg-gray-200 overflow-hidden">
                    {movie.Poster !== 'N/A' ? (
                      <img 
                        src={movie.Poster} 
                        alt={movie.Title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                        No poster available
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    
                    <h3 className="font-bold text-gray-800 truncate">{movie.Title}</h3>
                    <div className='flex justify-between'>
                      <div>
                    <p className="text-sm text-gray-600">Year: {movie.Year}</p>
                    <p className="text-sm text-gray-600">Type: {movie.Type}</p>
                      </div>
                      <TiHeartFullOutline className={`${isFavorite(movie)?"text-red-500 ":""} h-10 w-6`}  onClick={() => handleFavoriteClick(movie)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Right Navigation Button */}
            <button 
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/90 transition-colors"
              aria-label="Next movies"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={prevPage} 
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              Previous Page
            </button>
            <span className="px-4 py-2 bg-gray-200 rounded-md">Page {currentPage}</span>
            <button 
              onClick={nextPage} 
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              Next Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieSearch;