// third party
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from './contexts/ConfigContext';
import { ConfigProvider as AntConfigProvider } from 'antd';

// project imports
import App from './App';
import reportWebVitals from './reportWebVitals';

// style + assets
import './index.scss';
import 'antd/dist/reset.css';
// Suppress warnings in development mode
if (process.env.NODE_ENV === "development") {
  console.warn = () => {};
  console.error = () => {}; // Also suppress errors if needed
}

// -----------------------|| REACT DOM RENDER  ||-----------------------//

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <ConfigProvider>
     <AntConfigProvider
      theme={{
        token: {
          colorPrimary: '#088B46',  // your desired color
          colorBorder: 'black', // 👈 brighter blue-grey border

        },
      }}
    >
    <App />
    </AntConfigProvider>
  </ConfigProvider>
);

reportWebVitals();
