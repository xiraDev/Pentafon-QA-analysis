import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export function SearchNotFound({ query, sx, ...other }) {
  const { t } = useTranslate('common');

  if (!query) {
    return (
      <Typography variant="body2" sx={sx}>
        {t('search_placeholder')}
      </Typography>
    );
  }

  return (
    <Box sx={{ textAlign: 'center', borderRadius: 1.5, ...sx }} {...other}>
      <Box sx={{ mb: 1, typography: 'h6' }}>{t('not_found')}</Box>

      <Typography variant="body2">
        {t('no_results_for')} &nbsp;
        <strong>{`"${query}"`}</strong>
        .
        <br /> {t('try_different_keywords')}
      </Typography>
    </Box>
  );
}
