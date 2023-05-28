import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';

function AuthPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Outlet />
    </div>
  );
}

export default AuthPage;
