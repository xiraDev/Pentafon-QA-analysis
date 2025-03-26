// @mui
import { Container } from '@mui/material';

import Page from '../basic_components/Page';
import CampaignsManager from './components/CampaignsManager';


export default function CampaignContainer() {

  const themeStretch = false;

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <br/>
        <CampaignsManager />
      </Container>
    </Page>
  );
}
