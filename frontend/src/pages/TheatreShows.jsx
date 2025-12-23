import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { api } from "../utils/apiClient.js";
import { Layout } from "../components/Layout.jsx";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const formatTime = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Time TBA";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const TheatreShows = () => {
  const { movieId } = useParams();
  const query = useQuery();
  const cityId = query.get("cityId");
  const showDate = query.get("showDate");
  const [shows, setShows] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get(`/movies/${movieId}/shows`, {
        params: { cityId, showDate }
      });
      setShows(data);
    };
    load();
  }, [movieId, cityId, showDate]);

  const grouped = shows.reduce((acc, show) => {
    const key = show.theatre._id;
    if (!acc[key]) acc[key] = { theatre: show.theatre, shows: [] };
    acc[key].shows.push(show);
    return acc;
  }, {});

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <Layout>
      <div className="mb-4">
        <h1 className="text-lg font-semibold">Select theatre & show time</h1>
        {showDate && (
          <p className="text-xs text-slate-400 mt-1">{formatDate(showDate)}</p>
        )}
      </div>
      <div className="space-y-4">
        {Object.values(grouped).map(({ theatre, shows }) => (
          <div key={theatre._id} className="card">
            <div className="flex justify-between mb-2">
              <div>
                <h2 className="text-sm font-semibold">{theatre.name}</h2>
                <p className="text-[11px] text-slate-400">{theatre.address}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {shows.map((s) => (
                <Link
                  key={s._id}
                  to={`/shows/${s._id}/tickets`}
                  className="px-3 py-1 rounded-md text-xs border border-slate-700 hover:border-primary"
                >
                  {formatTime(s.startTime)}
                </Link>
              ))}
            </div>
          </div>
        ))}
        {shows.length === 0 && (
          <p className="text-sm text-slate-400">
            No shows for this movie in this city.
          </p>
        )}
      </div>
    </Layout>
  );
};

