import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

import App from './App';
import { CONFIG } from './config-global';
import { store, persistor } from './redux/store';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter basename={CONFIG.site.basePath}>
          <Suspense>
            <App />
          </Suspense>
        </BrowserRouter>
      </PersistGate>
    </ReduxProvider>
  </HelmetProvider>
);
