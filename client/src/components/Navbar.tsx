import { Link, useNavigate } from 'react-router-dom';
import { removeToken, isAuthenticated, getCurrentUser } from '../utils/auth';
import logo from '../assets/canban250.png';

const Navbar = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    removeToken();
    navigate('/'); // Redirect to landing page instead of login
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Canban Logo" className="h-8" />
          </Link>
          <div className="flex items-center space-x-4">
            {authenticated ? (
              <>
                <Link 
                  to="/create" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Create Ticket
                </Link>
                <span className="text-gray-600">|</span>
                <span className="text-gray-300">{currentUser?.username}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;