import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Loans from './pages/Loans';
import LoanDetail from './pages/LoanDetail';
import Housing from './pages/Housing';
import HousingDetail from './pages/HousingDetail';
import VerifyEmail from './pages/VerifyEmail';
import Transactions from './pages/Transactions';
import Transfer from './pages/Transfer';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="loans" element={<Loans />} />
            <Route path="loans/:slug" element={<LoanDetail />} />
            <Route path="housing" element={<Housing />} />
            <Route path="housing/:slug" element={<HousingDetail />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="transfer" element={<Transfer />} />
            <Route path="verify-email" element={<VerifyEmail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
