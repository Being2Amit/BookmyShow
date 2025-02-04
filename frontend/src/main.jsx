// src/main.jsx
import { createRoot } from 'react-dom/client'// Importing React and ReactDOM to render the React application
import { BrowserRouter } from 'react-router-dom';// Importing BrowserRouter to enable routing in the application
import { AuthProvider } from "./components/context/AuthContext";// Importing context providers for authentication and global application state management
import { AppContextProvider } from './components/context/AppContext'; // Import your AppContextProvider
import { Provider } from "react-redux";
import store  from "./components/redux/store"; 
// Importing Bootstrap styles for consistent and responsive design
import 'bootstrap/dist/css/bootstrap.min.css'; //Bootstrap CSS
import 'bootstrap-icons/font/bootstrap-icons.css';// Bootstrap Icons
import 'bootstrap/dist/js/bootstrap.bundle.min.js';// Bootstrap JavaScript (includes Popper.js)
import 'react-toastify/dist/ReactToastify.css';// React Toastify CSS
import App from './App';// Importing the main application component
import './index.css';// Custom CSS for the entire application

// Importing Font Awesome for global use
import { library } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { fas } from '@fortawesome/free-solid-svg-icons'; // Solid icons
import { far } from '@fortawesome/free-regular-svg-icons';// Regular icons
import { fab } from '@fortawesome/free-brands-svg-icons'; // Brand icons
library.add(fas, far, fab);// Add all icons to the library to use them throughout the app


// `createRoot` is a new React API (React 18+) to initialize the root of the React app.
// It takes the DOM element with the id 'root' as the target where the app will be rendered.
// `document.getElementById('root')` grabs the DOM element with the id 'root' from the HTML.Then,
//  `.render()` is called to render the JSX (React components) inside this root element.
createRoot(document.getElementById('root')).render(   
    <BrowserRouter> {/* BrowserRouter enables routing using the HTML5 history API to navigate between pages */}
    <AuthProvider> {/* AuthProvider provides authentication-related context to the entire app, such as user info or tokens */}
      <AppContextProvider>  {/* AppContextProvider manages and provides a global state to the entire app */}
        <Provider store = {store}>
        <App />{/* This is the main App component, which is the entry point of your app */}
        </Provider>
      </AppContextProvider>
    </AuthProvider>
  </BrowserRouter>
)