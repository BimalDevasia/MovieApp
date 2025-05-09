import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";

const FavMovie = () => {
  const [favMovies, setFavMovies] = useState([]);
  const [error, setError] = useState(null);

  // Fetch favourite movies
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/favourite", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch favourites");
        const data = await response.json();
        setFavMovies(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFavorites();
  }, []);

  // Delete favourite movie
  const handleDelete = async (movie) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/favourite/${movie.imdbID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete movie");
      setFavMovies(favMovies.filter((m) => m.imdbID !== movie.imdbID));
    } catch (err) {
      console.error(err);
      setError("Delete failed");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Favourite Movies</h1>
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {favMovies.length === 0 ? (
        <p className="text-center text-gray-600">No favourite movies found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favMovies.map((movie) => (
            <div
              key={movie.imdbID}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="h-64 bg-gray-200 overflow-hidden">
                {movie.Poster !== "N/A" ? (
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
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800 truncate">
                      {movie.Title}
                    </h3>
                    <p className="text-sm text-gray-600">Year: {movie.Year}</p>
                    <p className="text-sm text-gray-600">Type: {movie.Type}</p>
                  </div>
                  <MdDelete
                    className="text-red-500 hover:text-red-700 cursor-pointer text-xl"
                    onClick={() => handleDelete(movie)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavMovie;
