import Index from './components/Index'
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import {
  Route,
  BrowserRouter,
  Routes,
} from "react-router-dom";
import Signup from './components/Signup';
import AddDatabase from './components/AddDatabase';
import EditDatabase from './components/EditDatabase';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-database" element={<AddDatabase />} />
                <Route path="/edit-database" element={<EditDatabase />} />
            </Routes>
        </BrowserRouter>
    );
};
export default App;
