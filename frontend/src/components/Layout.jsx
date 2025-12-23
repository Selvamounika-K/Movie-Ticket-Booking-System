import { Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between py-3 px-4">
          <Link to="/movies" className="flex items-center gap-2">
            <span className="h-7 w-7 rounded bg-primary flex items-center justify-center text-xs font-semibold">
              MB
            </span>
            <span className="font-semibold tracking-tight">Movie Tickets</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/movies" className="hover:text-primary">
              Movies
            </Link>
            <Link to="/bookings" className="hover:text-primary">
              My bookings
            </Link>
            {user ? (
              <>
                
                <button
                  onClick={logout}
                  className="text-xs border border-slate-700 px-2 py-1 rounded-md hover:border-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="text-xs border border-slate-700 px-3 py-1 rounded-md hover:border-primary">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6">{children}</div>
      </main>
    </div>
  );
};

