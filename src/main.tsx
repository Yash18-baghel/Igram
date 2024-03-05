import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { QueryProvider } from "./lib/react-query/QueryProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <QueryProvider>
            <AuthProvider>
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_SIGN_IN_CLIENT_ID}>
                    <App />
                </GoogleOAuthProvider>
            </AuthProvider>
        </QueryProvider>
    </BrowserRouter>
)