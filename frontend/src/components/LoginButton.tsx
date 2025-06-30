import { useMsal } from '@azure/msal-react';

const LoginButton = () => {
  const { instance, accounts } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(); // you can use loginPopup() instead if preferred
  };

  const handleLogout = () => {
    instance.logoutRedirect(); // or logoutPopup()
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      {accounts.length > 0 ? (
        <div>
          <p>Signed in as: {accounts[0].username}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login with Azure AD</button>
      )}
    </div>
  );
};

export default LoginButton;
