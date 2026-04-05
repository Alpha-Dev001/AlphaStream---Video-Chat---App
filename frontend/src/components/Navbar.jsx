import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, LogOutIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isNotHomePage = location.pathname !== "/";

  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          <Link
            to="/"
            className="text-lg sm:text-xl font-semibold font-mono tracking-tight text-primary"
          >
            AlphaStream
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {isNotHomePage && (
              <Link to="/" className="btn btn-ghost btn-circle" title="Back to Home">
                <HomeIcon className="h-6 w-6 text-base-content opacity-70" />
              </Link>
            )}

            <Link to="/notifications">
              <button className="btn btn-ghost btn-circle" title="Notifications">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>

            <ThemeSelector />

            <div className="avatar">
              <div className="w-9 rounded-full">
                <img
                  src={authUser?.profilePic || '/default-avatar.svg'}
                  alt="User Avatar"
                  onError={(e) => {
                    e.target.src = '/default-avatar.svg';
                  }}
                />
              </div>
            </div>

            <button className="btn btn-ghost btn-circle" onClick={logoutMutation} title="Logout">
              <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
