import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import LoginButton from './components/LoginButton';
import EmployeeForm from './components/EmployeeForm';
import FileUpload from './components/FileUpload';
import SASLink from './components/SASLink';

function App() {
  const { instance, accounts } = useMsal();
  const [sasUrl, setSasUrl] = useState('');

  const handleEmployeeSubmit = async (employee: { name: string; email: string }) => {
    console.log('Employee submitted:', employee);
    // 🔧 Later you’ll replace this with a call to your backend
  };

  const handleFileUpload = (url: string) => {
    setSasUrl(url);
  };

  return (
    <div className="App">
      <LoginButton />

      {accounts.length > 0 ? (
        <div>
          <h2>Welcome, {accounts[0].name}</h2>
          <EmployeeForm onSubmit={handleEmployeeSubmit} />
          <FileUpload onUpload={handleFileUpload} />
          <SASLink url={sasUrl} />
        </div>
      ) : (
        <p>Please log in to continue.</p>
      )}
    </div>
  );
}

export default App;
