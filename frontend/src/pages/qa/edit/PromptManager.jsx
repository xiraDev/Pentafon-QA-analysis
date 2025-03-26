// @mui
import { Container } from '@mui/material';

// hooks

import Page from '../basic_components/Page';
import PromptEditor from './components/PromptsEditor';
// import { useTranslate as useLocales } from '../../../locales/use-locales';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  // const { t: translate } = useLocales();

  const themeStretch = false;

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <br/>
        <PromptEditor />
      </Container>
    </Page>
  );
}
