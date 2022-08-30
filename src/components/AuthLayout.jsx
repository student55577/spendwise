import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function AuthLayout () {
    const location= useLocation();
    const token = localStorage.getItem("token")
    return token
    ? <Outlet />
    : (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
};

export default AuthLayout 