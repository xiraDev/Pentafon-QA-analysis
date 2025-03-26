import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// @mui
import { Card, Stack, Switch, Typography, FormControlLabel } from '@mui/material';

// hooks
import { useTranslate } from 'src/locales';
// api
import { updateConfig } from 'src/api/services/config.service';

import { toast } from 'src/components/snackbar';

// ----------------------------------------------------------------------

const ConfigReportContactActions = ({ config }) => {
  const { t, currentLang } = useTranslate('common');

  const [isEnableReportAfterContactAction, setIsEnableReportAfterContactAction] = useState(false);

  useEffect(() => {
    setIsEnableReportAfterContactAction(config.isEnableReportAfterContactAction);
  }, [config]);

  // Manejar el cambio en el switch
  const handleToggle = async (event) => {
    const newValue = event.target.checked;
    setIsEnableReportAfterContactAction(newValue);

    try {
      const res = await updateConfig({ isEnableReportAfterContactAction: newValue });
      toast.success(res.message?.[currentLang.value] || "Config updated");
    } catch (error) {
      console.error('Error al actualizar la configuración :', error);
      toast.error(error.message?.[currentLang.value] || "Something went wrong");
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {t('config_report_contact_actions_title')}
        </Typography>
        <FormControlLabel
          control={<Switch checked={isEnableReportAfterContactAction} onChange={handleToggle} color="primary" />}
          label={t('config_report_contact_actions_label')}
        />
      </Stack>
    </Card>
  );
};

ConfigReportContactActions.propTypes = {
  config: PropTypes.oneOfType([PropTypes.object]),
};

export default ConfigReportContactActions;
