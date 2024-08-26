import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './assets/css/app.css'
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path:'/products',
    element: <h1>Hola boludito</h1>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <RouterProvider router={router} />
  </StrictMode>,
)
