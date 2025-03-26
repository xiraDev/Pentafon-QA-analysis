import React, { useState, useEffect } from 'react';

import { Stack } from '@mui/material';

import { PATH_DASHBOARD } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import { getConfig } from 'src/api/services/config.service';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// import ConfigWhatsapp from '../config-whatsapp';
import ConfigEmailRecipients from '../config-email-recipients';
// import ConfigReportContactActions from '../config-report-contact-actions';

// ----------------------------------------------------------------------

export const ConfigView = () => {
  const { t } = useTranslate('common');

  const [config, setConfig] = useState({});

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await getConfig();
        setConfig(response);
      } catch (error) {
        console.error('Error al obtener la configuración', error);
      }
    };

    fetchConfig();
  }, []);

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading={t('config_heading')}
        links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: t('config_heading') }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={3}>
        {/* <ConfigWhatsapp config={config} />
        <ConfigReportContactActions config={config} /> */}
        <ConfigEmailRecipients config={config} />
      </Stack>
    </DashboardContent>
  );
};
