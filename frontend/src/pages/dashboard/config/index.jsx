import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ConfigView } from 'src/sections/management/config/view';

// ----------------------------------------------------------------------

const metadata = { title: `Configuración | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ConfigView />
    </>
  );
}
