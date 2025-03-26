import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import { Card, Stack, Switch, Typography, FormControlLabel } from '@mui/material';

import { useTranslate } from 'src/locales';
import { updateConfig } from 'src/api/services/config.service';

import { toast } from 'src/components/snackbar';

// ----------------------------------------------------------------------

const ConfigWhatsapp = ({ config }) => {
  const { t, currentLang } = useTranslate('common');

  const [isEnableWhatsappChatbot, setisEnableWhatsappChatbot] = useState(false);

  useEffect(() => {
    setisEnableWhatsappChatbot(config.isEnableWhatsappChatbot);
  }, [config]);

  // Manejar el cambio en el switch
  const handleToggle = async (event) => {
    const newValue = event.target.checked;
    setisEnableWhatsappChatbot(newValue);

    try {
      const res = await updateConfig({ isEnableWhatsappChatbot: newValue });
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
          {t('config_whatsapp_chatbot_title')}
        </Typography>
        <FormControlLabel
          control={<Switch checked={isEnableWhatsappChatbot} onChange={handleToggle} color="primary" />}
          label={t('config_whatsapp_chatbot_label')}
        />
      </Stack>
    </Card>
  );
};

ConfigWhatsapp.propTypes = {
  config: PropTypes.oneOfType([PropTypes.object]),
};

export default ConfigWhatsapp;
