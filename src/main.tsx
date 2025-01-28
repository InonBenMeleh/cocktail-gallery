import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import IndexDBManager from "./services/indexDBManager.ts"

const initializeApp = async () => {
    try {
        await IndexDBManager.getInstance();
        console.log("IndexDB initialized successfully.");
        createRoot(document.getElementById('root')!).render(
            <StrictMode>
                <App />
            </StrictMode>
        );
    } catch (error) {
        console.error("Failed to initialize IndexDB:", error);
    }
};

initializeApp();
