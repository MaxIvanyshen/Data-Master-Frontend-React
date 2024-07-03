import Index from './components/Index'
import Login from './components/Login';
import {
  Route,
  BrowserRouter,
  Routes,
} from "react-router-dom";
import Signup from './components/Signup';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </BrowserRouter>
    );
};
export default App;
