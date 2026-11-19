import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ouvirInstalacao } from '../pwa/instalacao';
import { registrarServiceWorker } from '../pwa/atualizacao';
import '../styles.css';

ouvirInstalacao();
registrarServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
