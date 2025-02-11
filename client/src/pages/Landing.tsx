import { Link } from 'react-router-dom';
import logo from '../assets/canban250.png';
import kanbanImage from '../assets/kanban.png';

const Landing = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 p-8">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Canban Logo" className="h-10" />
            <span className="text-2xl font-bold tracking-tight">
            </span>
          </div>
          <Link 
            to="/login" 
            className="text-sm font-medium hover:text-indigo-400 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="container mx-auto px-8">
        <div className="min-h-screen flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-8xl font-bold tracking-tighter mb-8">
                Ban chaos.
                <br />
                <span className="text-indigo-500">Embrace flow.</span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-12 max-w-2xl">
                Experience seamless task management with our intuitive Kanban board. 
                Organize, prioritize, and visualize your workflow like never before.
              </p>

              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="border border-gray-700 hover:border-indigo-500 text-white px-8 py-4 rounded-lg font-medium transition-colors"
                >
                  Sign-In
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src={kanbanImage} 
                alt="Kanban Board Preview" 
                className="rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;