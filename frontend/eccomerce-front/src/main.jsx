import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import UsersTable from './components/tableDashboard/Table.jsx'
import ProductsTable from './components/productsDashboard/Table.jsx'

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
    element: <UsersTable/>
  },
  {
    path: '/productos',
    element: <ProductsTable/>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <RouterProvider router={router} />
  </StrictMode>,
)
