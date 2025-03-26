import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserCreateEditView } from 'src/sections/management/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `Nuevo usuario | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserCreateEditView />
    </>
  );
}
