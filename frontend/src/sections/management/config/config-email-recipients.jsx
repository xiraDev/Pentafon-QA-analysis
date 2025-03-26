import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
// @mui
import { Card, List, Stack, Button, ListItem, TextField, Typography, IconButton, ListItemText } from '@mui/material';

// hooks
import { useTranslate } from 'src/locales';
// api
import { updateConfig } from 'src/api/services/config.service';

import { toast } from 'src/components/snackbar';


const emailMessagesStatus = {
  en: {
    warning: 'Please enter an email.',
    error: 'Please enter a valid email.',
    success: 'Email added successfully',
    failed: 'Failed to add email',
    deletedSuccess: 'Email deleted successfully',
    deletedFailed: 'Failed to delete email',
  },
  es: {
    warning: 'Por favor, ingrese un correo electrónico.',
    error: 'Por favor, ingrese un correo electrónico válido.',
    success: 'Correo electrónico agregado correctamente',
    failed: 'Error al agregar el correo electrónico',
    deletedSuccess: 'Correo electrónico eliminado correctamente',
    deletedFailed: 'Error al eliminar el correo electrónico',
  }
};

// ----------------------------------------------------------------------

const ConfigEmailRecipients = ({ config }) => {
  const { t, currentLang } = useTranslate('common');

  const [email, setEmail] = useState('');
  const [emailList, setEmailList] = useState(config.reportRecipientEmails || []);

  useEffect(() => {
    // Actualizar la lista de correos si config cambia
    setEmailList(config.reportRecipientEmails || []);
  }, [config]);

  // Función para validar si el correo tiene un formato válido
  const isValidEmail = (recipientEmail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(recipientEmail);
  };

  const handleAddEmail = async () => {
    if (!email) {
      toast.warning(emailMessagesStatus[currentLang.value].warning);
      return;
    }

    if (!isValidEmail(email)) {
      toast.error(emailMessagesStatus[currentLang.value].error);
      return;
    }

    const newEmailList = [...emailList, email];
    setEmailList(newEmailList);
    setEmail('');

    try {
      await updateConfig({ reportRecipientEmails: newEmailList });
      toast.success(emailMessagesStatus[currentLang.value].success);
    } catch (error) {
      console.error('Error al actualizar la configuración :', error);
      toast.error(emailMessagesStatus[currentLang.value].failed);
    }
  };

  const handleRemoveEmail = async (emailToRemove) => {
    const newEmailList = emailList.filter((e) => e !== emailToRemove);
    setEmailList(newEmailList);

    try {
      await updateConfig({ reportRecipientEmails: newEmailList });
      toast.success(emailMessagesStatus[currentLang.value].deletedSuccess);
    } catch (error) {
      console.error('Error al actualizar la configuración :', error);
      toast.error(emailMessagesStatus[currentLang.value].deletedFailed);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {t('config_email_recipients_title')}
        </Typography>
        <TextField
          label={t('config_email_recipients_add_email_label')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddEmail}>
          {t('config_email_recipients_add_email_submit')}
        </Button>
        <List>
          {emailList.map((_email) => (
            <ListItem
              key={_email}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveEmail(_email)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={_email} />
            </ListItem>
          ))}
        </List>
      </Stack>
    </Card>
  );
};

ConfigEmailRecipients.propTypes = {
  config: PropTypes.oneOfType([PropTypes.object]),
};

export default ConfigEmailRecipients;
