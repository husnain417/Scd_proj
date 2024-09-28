import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login1 from '../src/pages/login/Login1';
import Signup from './pages/signup/Signup';
import Email_ver from './pages/email_ver/Email_ver';
import Account_ver from './pages/accountverifiedregister/Account_ver';
import Dashboard from './pages/dashboard/Dashboard';
import Emailinput from './pages/forgotpass/Emailinput';
import Newpass from './pages/forgotpass/Newpass';
import Account from './pages/accounts/Account';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import UserAcc from './pages/useraccounts/UserAcc';
import Create from './pages/accounts/Create';
import Balance from './pages/accounts/Balance';
import Transactions from './pages/transaction/Transactions';
import Deposit from './pages/Transaction_screens/Deposit';
import Withdraw from './pages/Transaction_screens/Withdraw';
import Transfer from './pages/Transaction_screens/Transfer';
import History from './pages/Transaction_screens/History';
import PrivateRoute from './components/privateRoute/privateRoute';
import Beneficiary from './pages/beneficiaries/Beneficiary';
import Ben_render from './pages/Benficiary_render/Ben_render';
import Add from './pages/Benficiary_render/Add';
import Update from './pages/Benficiary_render/Update';
import Search from './pages/Benficiary_render/Search';
import Changepass from './pages/profile/Changepass';
import Profile from './pages/profile/Profile';
import Landing from './landingpage/src/Landing';

const NotFound = () => <h1>404 - Page Not Found</h1>;

const App = () => (
  <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login1 />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/emailverification" element={<Email_ver />} />
        <Route path="/accountverified" element={<Account_ver />} />
        <Route path="/forgotpass" element={<Emailinput />} />
        <Route path="/newpass" element={<Newpass />} />

        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/user-accounts" element={<PrivateRoute><UserAcc /></PrivateRoute>} />
        <Route path="/accounts" element={<PrivateRoute><Account /></PrivateRoute>} />
        <Route path="/create-account" element={<PrivateRoute><Create /></PrivateRoute>} />
        <Route path="/balance" element={<PrivateRoute><Balance /></PrivateRoute>} />
        <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
        <Route path="/deposit" element={<PrivateRoute><Deposit /></PrivateRoute>} />
        <Route path="/withdraw" element={<PrivateRoute><Withdraw /></PrivateRoute>} />
        <Route path="/transfer" element={<PrivateRoute><Transfer /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
        <Route path="/beneficiary" element={<PrivateRoute><Ben_render /></PrivateRoute>} />
        <Route path="/beneficiary_ele" element={<PrivateRoute><Beneficiary /></PrivateRoute>} />
        <Route path="/beneficiary_add" element={<PrivateRoute><Add /></PrivateRoute>} />
        <Route path="/beneficiary_update" element={<PrivateRoute><Update /></PrivateRoute>} />
        <Route path="/beneficiary_search" element={<PrivateRoute><Search /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/changepass" element={<PrivateRoute><Changepass /></PrivateRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  </Router>
);

export default App;
