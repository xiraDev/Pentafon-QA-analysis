import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserListView } from 'src/sections/management/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `Lista de usuarios | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserListView />
    </>
  );
}
