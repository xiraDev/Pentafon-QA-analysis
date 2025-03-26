import { lazy, Suspense } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------


// QA Analysis
const QADashboard = lazy(() => import('src/pages/qa/dashboard/GeneralApp'));
const QAPromptEditor = lazy(() => import('src/pages/qa/edit/PromptManager'));
const QAAnalytics = lazy(() => import('src/pages/qa/analytics/AnalyticsDashboard'));
const QAAudios = lazy(() => import('src/pages/qa/audioUploader/AudioUploadMain'));
const QACampaignsContainer = lazy(() => import('src/pages/qa/campaigns/CampaignContainer'))

// User
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/editUser'));

// Config
const ConfigPage = lazy(() => import('src/pages/dashboard/config'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <QADashboard />, index: true },
      {
        path: 'qa',
        children: [
          { element: <Navigate to="/dashboard/qa/dashboard" replace />, index: true },
          { path: 'dashboard', element: <QADashboard /> },
          { path: 'edit', element: (
            <RoleBasedGuard hasContent acceptRoles={['administrator', 'root']}>
               <QAPromptEditor />
            </RoleBasedGuard>
          ) },
          { path: 'analytics', element: <QAAnalytics /> },
          { path: 'audios', element: <QAAudios /> },
          { path: 'campaigns', element: (
            <RoleBasedGuard hasContent acceptRoles={['administrator', 'root']}>
              <QACampaignsContainer />
            </RoleBasedGuard>
          ) },
        ],
      },
      {
        path: 'user',
        children: [
          { element: <Navigate to="/dashboard/user/account" replace />, index: true },
          {
            path: 'list',
            element: (
              <RoleBasedGuard hasContent acceptRoles={['administrator', 'root']}>
                <UserListPage />
              </RoleBasedGuard>
            ),
          },
          { path: 'account', element: <UserAccountPage /> },
          {
            path: 'new',
            element: (
              <RoleBasedGuard hasContent acceptRoles={['administrator', 'root']}>
                <UserCreatePage />
              </RoleBasedGuard>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <RoleBasedGuard hasContent acceptRoles={['administrator', 'root']}>
                <UserEditPage />
                {/* <ConfigPage /> */}
              </RoleBasedGuard>
            ),
          },
        ],
      },
      {
        path: 'config',
        element: (
          <RoleBasedGuard hasContent acceptRoles={['administrator', 'root']}>
            <ConfigPage />
          </RoleBasedGuard>
        ),
      },
    ],
  },
];
