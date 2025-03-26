// @mui
import { Container } from '@mui/material';

import Page from '../basic_components/Page';
import ConversationsTable from './components/ConversationsTable';


export default function GeneralApp() {

  const themeStretch = false;

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        
        <ConversationsTable />
      </Container>
    </Page>
  );
}
