import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthSplitLayout } from 'src/layouts/auth-split';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

/** **************************************
 * Jwt
 *************************************** */
const Jwt = {
  SignInPage: lazy(() => import('src/pages/auth/jwt/sign-in')),
  // SignUpPage: lazy(() => import('src/pages/auth/jwt/sign-up')),
};

// ----------------------------------------------------------------------

export const authRoutes = [
  {
    path: 'auth',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        path: 'login',
        element: (
          <GuestGuard>
            <AuthSplitLayout section={{ title: 'welcome_back', subtitle: 'welcome_subtitle' }}>
              <Jwt.SignInPage />
            </AuthSplitLayout>
          </GuestGuard>
        ),
      },
      // {
      //   path: 'sign-up',
      //   element: (
      //     <GuestGuard>
      //       <AuthSplitLayout>
      //         <Jwt.SignUpPage />
      //       </AuthSplitLayout>
      //     </GuestGuard>
      //   ),
      // },
    ],
  },
];
