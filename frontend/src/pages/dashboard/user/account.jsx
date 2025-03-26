import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserAccountView } from 'src/sections/management/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `Configuraciones de la cuenta | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserAccountView />
    </>
  );
}
