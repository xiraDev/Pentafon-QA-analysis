import React from 'react';

import { Tab, Tabs } from '@mui/material';

import { PATH_DASHBOARD } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import AccountGeneral from '../user-account-general';
import AccountChangePassword from '../user-account-change-password';

// ----------------------------------------------------------------------

export const UserAccountView = () => {
  const { t } = useTranslate('common');

  const tabs = useTabs('general');

  const TABS = [
    {
      value: 'general',
      label: t('account_settings_general'),
      icon: <Iconify icon="ic:round-account-box" width={20} height={20} />,
    },
    {
      value: 'security',
      label: t('account_settings_access'),
      icon: <Iconify icon="ic:round-vpn-key" width={20} height={20} />,
    },
  ];

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading={t('account_settings_heading')}
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          { name: t('user'), href: PATH_DASHBOARD.user.root },
          { name: t('settings') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs
        allowScrollButtonsMobile
        variant="scrollable"
        scrollButtons="auto"
        value={tabs.value}
        onChange={tabs.onChange}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        {TABS.map((tab) => (
          <Tab disableRipple key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {tabs.value === 'general' && <AccountGeneral />}

      {tabs.value === 'security' && <AccountChangePassword />}
    </DashboardContent>
  );
};
