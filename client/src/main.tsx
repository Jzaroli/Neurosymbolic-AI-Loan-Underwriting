import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './global.css';
import App from './App.tsx';
import Home from './pages/Home.tsx';

const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      errorElement: <h1>Wrong page!</h1>,
      children: [
        { 
          index: true, 
          element: <Home /> 
        }
      ],
    },
  ])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)