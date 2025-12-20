import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 mb-3 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 mb-4 rounded"
        />

        <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Register
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
