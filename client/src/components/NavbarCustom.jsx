import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const businessName = import.meta.env.VITE_BUS_NAME || "MyBusiness";

const NavbarCustom = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar bg-gray-900 text-white shadow mb-4 px-4">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          {businessName}
        </Link>
      </div>

      <div className="flex-none flex items-center space-x-6">
  {user ? (
    <>
      <span className="text-white">Hello, {user.username}!</span>

      <details className="relative">
        <summary className="cursor-pointer px-3 py-2 rounded hover:bg-gray-700">
          Customers
        </summary>
        <ul className="absolute mt-1 bg-gray-800 rounded shadow w-40 p-2 z-50">
          <li>
            <Link
              to="/Customers"
              className="block px-2 py-1 hover:bg-gray-700 rounded"
            >
              View all
            </Link>
          </li>
          <li>
            <hr className="border-gray-700 my-1" />
          </li>
          <li>
            <Link
              to="/Customers/new"
              className="block px-2 py-1 hover:bg-gray-700 rounded"
            >
              Add New Client
            </Link>
          </li>
        </ul>
      </details>

      <details className="relative">
        <summary className="cursor-pointer px-3 py-2 rounded hover:bg-gray-700">
          Todo
        </summary>
        <ul className="absolute mt-1 bg-gray-800 rounded shadow w-40 p-2 z-50">
          <li>
            <Link
              to="/Tasks"
              className="block px-2 py-1 hover:bg-gray-700 rounded"
            >
              View Tasks
            </Link>
          </li>
        </ul>
      </details>

      <details className="relative">
        <summary className="cursor-pointer px-3 py-2 rounded hover:bg-gray-700">
          Finance
        </summary>
        <ul className="absolute mt-1 bg-gray-800 rounded shadow w-40 p-2 z-50">
          <li>
            <Link
              to="/reports"
              className="block px-2 py-1 hover:bg-gray-700 rounded"
            >
              Reports
            </Link>
          </li>
          <li>
            <Link
              to="/invoices"
              className="block px-2 py-1 hover:bg-gray-700 rounded"
            >
              Invoices
            </Link>
          </li>
        </ul>
      </details>

      <details className="relative">
        <summary className="cursor-pointer px-3 py-2 rounded hover:bg-gray-700">
          Products
        </summary>
        <ul className="absolute mt-1 bg-gray-800 rounded shadow w-40 p-2 z-50">
          <li>
            <Link
              to="/Products"
              className="block px-2 py-1 hover:bg-gray-700 rounded"
            >
              View all
            </Link>
          </li>
          <li>
            <Link
              to="/Products/new"
              className="block px-2 py-1 hover:bg-gray-700 rounded"
            >
              Add Product
            </Link>
          </li>
        </ul>
      </details>

      <button
        onClick={handleLogout}
        className="btn btn-outline btn-sm ml-2"
        type="button"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link
        to="/login"
        className="px-3 py-2 rounded hover:bg-gray-700"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="px-3 py-2 rounded hover:bg-gray-700"
      >
        Register
      </Link>
    </>
  )}
</div>


    </nav>
  );
};

export default NavbarCustom;
