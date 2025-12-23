import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../utils/apiClient.js";
import { Layout } from "../components/Layout.jsx";

export const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const load = async () => {
      const [m, c] = await Promise.all([
        api.get("/movies"),
        api.get("/cities")
      ]);
      setMovies(m.data);
      setCities(c.data);
      if (c.data.length) setSelectedCity(c.data[0]._id);
    };
    load();
  }, []);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Now showing</h1>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-md px-3 py-1 text-xs"
        >
          {cities.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {movies.map((movie) => (
          <div key={movie._id} className="card flex gap-3">
            {movie.posterUrl && (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded-md"
              />
            )}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="font-semibold text-sm">{movie.title}</h2>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {movie.description}
                </p>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-[11px] text-slate-400">
                  {movie.language} • {movie.duration} min
                </span>
                <Link
                  to={`/movies/${movie._id}/dates?cityId=${selectedCity}`}
                  className="btn-primary text-xs"
                >
                  Book
                </Link>
              </div>
            </div>
          </div>
        ))}
        {movies.length === 0 && (
          <p className="text-sm text-slate-400">No movies found.</p>
        )}
      </div>
    </Layout>
  );
};

