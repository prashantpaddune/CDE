import { createRoot } from 'react-dom/client';
import './index.css';
import AppRouter from "./components";

const el = document.getElementById('root');

el && createRoot(el).render(<AppRouter/>);