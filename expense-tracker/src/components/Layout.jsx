import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between">
        <h1 className="font-bold text-xl">Expense Tracker</h1>
        <div className="space-x-4">
          <Link to="/dashboard" className="text-gray-600 hover:text-black">
            Dashboard
          </Link>
          <Link to="/add" className="text-gray-600 hover:text-black">
            Add
          </Link>
          <Link to="/friends" className="text-gray-600 hover:text-black">
            Friends
          </Link>
        </div>
      </nav>

      <main className="p-6">{children}</main>
    </div>
  );
}
    