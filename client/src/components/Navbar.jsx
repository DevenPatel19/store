import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Environment variables must use REACT_APP_ prefix
const businessName = import.meta.env.VITE_BUS_NAME  || 'MyBusiness'; // Fallback name




const Navbar = () => {
  const {user, logout} = useContext(AuthContext);
  
  const navigate = useNavigate();

    const handleLogout = () => {
      logout();
      navigate('/login')
    }

  return (
    <nav className='bg-white shadow-md p-4'>
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
            <Link to='/'>
              <h1>{businessName} Navbar</h1>
            </Link>
            <div className='flex gap-x-4'>
             {user ? (
             <div className='flex gap-x-4' >
              <div >
                Hello, {user.username}!
              </div>
              <Link to="/Product/new">
                <button>Add Product</button>
              </Link>
              <Link to="/Product/:id/edit">
                <button>Edit Product</button>
              </Link>
              <Link to="/Product/:id">
                <button>Get Product</button>
              </Link>

              <button 
                onClick={handleLogout}
                className='text-gray-600 hover:text-white hover:bg-gray-800'>Logout</button>
             </div>
            ): (
              <>
                <Link to={'/login'}>
                  <button>Login</button>
                </Link>
                <Link to={'/register'}>
                  <button>Register</button>
                </Link>
              </>
            )
             }
            </div>
        </div>
    </nav>
  );
};

export default Navbar