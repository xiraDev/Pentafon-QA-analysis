import { Navigate, useRoutes } from 'react-router-dom';

import { CONFIG } from 'src/config-global';

import { authRoutes } from './auth';
import { mainRoutes } from './main';
import { dashboardRoutes } from './dashboard';

// ----------------------------------------------------------------------

export function Router() {
  return useRoutes([
    {
      path: '/',
      /**
       * Skip home page
       */
      element: <Navigate to={CONFIG.auth.redirectPath} replace />,
    },

    // Auth
    ...authRoutes,

    // dashboard
    ...dashboardRoutes,

    // Main
    ...mainRoutes,

    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
