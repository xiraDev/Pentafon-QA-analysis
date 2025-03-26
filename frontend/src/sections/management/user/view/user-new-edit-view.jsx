import React from 'react';
import { capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';

// routes
import { PATH_DASHBOARD } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import UserNewEditForm from '../user-new-edit-form';

// ----------------------------------------------------------------------

export const UserCreateEditView = () => {
  const { t } = useTranslate('common');

  const { pathname } = useLocation();

  const { name = '' } = useParams();

  const isEdit = pathname.includes('edit');

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading={!isEdit ? t('create_new_user_heading') : 'Edit user'}
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          { name: t('user'), href: PATH_DASHBOARD.user.root },
          { name: !isEdit ? t('create_new_user_label') : capitalCase(name) },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserNewEditForm isEdit={isEdit} currentUser={{}} />
    </DashboardContent>
  );
};
