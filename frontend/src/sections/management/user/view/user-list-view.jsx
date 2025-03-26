import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// @mui
import { Button } from '@mui/material';

// routes
import { PATH_DASHBOARD } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
// components
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import UserList from '../user-list';

// ----------------------------------------------------------------------

export const UserListView = () => {
  const { t } = useTranslate('common');

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading={t('user_list_heading')}
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          { name: t('user'), href: PATH_DASHBOARD.user.root },
          { name: t('list') },
        ]}
        action={
          <Button
            to={PATH_DASHBOARD.user.new}
            variant="text"
            startIcon={<Iconify icon="eva:plus-fill" />}
            component={RouterLink}
          >
            {t('create_new_user_label')}
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserList />
    </DashboardContent>
  );
};
