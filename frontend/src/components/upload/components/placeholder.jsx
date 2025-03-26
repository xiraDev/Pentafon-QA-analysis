import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { useTranslate } from 'src/locales';
import { UploadIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export function UploadPlaceholder({ ...other }) {
  const { t } = useTranslate('common');

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      {...other}
    >
      <UploadIllustration hideBackground sx={{ width: 200 }} />

      <Stack spacing={1} sx={{ textAlign: 'center' }}>
        <Box sx={{ typography: 'h6' }}> {t('upload_block_title')}</Box>
        <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
          {t('upload_block_message_1')}
          <Box component="span" sx={{ mx: 0.5, color: 'primary.main', textDecoration: 'underline' }}>
            {t('upload_block_message_2')}
          </Box>
          {t('upload_block_message_3')}
        </Box>
      </Stack>
    </Box>
  );
}
