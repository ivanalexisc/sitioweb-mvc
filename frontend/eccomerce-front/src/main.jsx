import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Table from './components/tableDashboard/Table.jsx'

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
    path:'/usuarios',
    element: <Table/>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <RouterProvider router={router} />
  </StrictMode>,
)
