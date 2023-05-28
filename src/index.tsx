import React from 'react';
import ReactDOM from 'react-dom/client';
import './utils/firebase';
import './default.css';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import AuthPage from './pages/Auth/AuthPage';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import HomePage from './pages/Home/HomePage';
import { Provider } from 'react-redux';
import { store } from './utils/redux/store';
import { ChakraProvider } from '@chakra-ui/react';
import WorkPlace from './components/WorkPlace/WorkPlace';
import WorkPlaces from './components/WorkPlace/WorkPlaces';
import Profile from './components/Profile/Profile';
import { registerLicense } from '@syncfusion/ej2-base';
import ScrumShield from './components/Scrum/ScrumShield';

registerLicense(
  'ORg4AjUWIQA/Gnt2VFhiQlJPcEBAWnxLflF1VWVTfVd6dVBWESFaRnZdQV1mS3ZTcEFmXXZad3FU'
);

// Router
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/auth" />,
  },
  {
    path: '/auth',
    element: <Navigate to="/auth/register" />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
    children: [
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
  {
    path: '/home',
    element: <Navigate to="/home/workplaces" />,
  },
  {
    path: '/home',
    element: <HomePage />,
    children: [
      {
        path: 'workplaces',
        element: <WorkPlaces />,
      },
      {
        path: 'workplace/:id/chats',
        element: <WorkPlace />,
      },
      {
        path: 'workplace/:id/scrum',
        element: <ScrumShield />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </Provider>
);
