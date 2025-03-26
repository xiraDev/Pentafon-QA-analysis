// core (MUI)
import { esES as esESCore } from '@mui/material/locale';
// date pickers (MUI)
import { enUS as enUSDate, esES as esESDate } from '@mui/x-date-pickers/locales';
// data grid (MUI)
// import {
//   enUS as enUSDataGrid,
//   esES as esESDataGrid,
// } from '@mui/x-data-grid/locales';

// ----------------------------------------------------------------------

export const allLangs = [
  {
    value: 'es',
    label: 'Spanish',
    countryCode: 'MX',
    adapterLocale: 'es-mx',
    numberFormat: { code: 'es-MX', currency: 'MXN' },
    systemValue: {
      components: { ...esESCore.components, ...esESDate.components },
    },
  },
  {
    value: 'en',
    label: 'English',
    countryCode: 'US',
    adapterLocale: 'en',
    numberFormat: { code: 'en-US', currency: 'USD' },
    systemValue: {
      components: { ...enUSDate.components },
    },
  },
];

/**
 * Country code:
 * https://flagcdn.com/en/codes.json
 *
 * Number format code:
 * https://gist.github.com/raushankrjha/d1c7e35cf87e69aa8b4208a8171a8416
 */
