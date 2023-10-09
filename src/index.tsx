import 'react-complex-tree/lib/style-modern.css';
import 'dockview/dist/styles/dockview.css';
import 'xterm/css/xterm.css';
import './index.css';
import { createRoot } from 'react-dom/client';
import AppRouter from "./components";

const el = document.getElementById('root');

el && createRoot(el).render(<AppRouter/>);