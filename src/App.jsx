import { Link, Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-950 py-2 shadow-lg">
        <div className="container mx-auto flex justify-center space-x-15 text-xl font-semibold">
          <Link to="/"
            className="hover:text-blue-400 transition-colors duration-200">Calculator
          </Link>
          <Link to="/shader"
            className="hover:text-purple-400 transition-colors duration-200">Text to Shader
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 ">
        <Outlet />
      </main>
    </div>
  );
}
