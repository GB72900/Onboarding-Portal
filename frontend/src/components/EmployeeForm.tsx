import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import axios from 'axios';

interface Employee {
  name: string;
  email: string;
}

interface Props {
  onSubmit: (data: Employee) => void;
}

const EmployeeForm: React.FC<Props> = ({ onSubmit }) => {
  const [employee, setEmployee] = useState<Employee>({ name: '', email: '' });
  const { instance, accounts } = useMsal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const tokenResponse = await instance.acquireTokenSilent({
        scopes: ['api://4d377044-a28d-47c5-befd-2d0e92c58dbf/access_as_user'],
        account: accounts[0],
      });

      const accessToken = tokenResponse.accessToken;

      const nameParts = employee.name.trim().split(" ");
      const mailNickname = nameParts[0]?.toLowerCase() || "user";

      const userData = {
        displayName: employee.name,
        mailNickname: mailNickname,
        userPrincipalName: employee.email,
        password: "Test1234!" // Replace with a secure generator in production
      };

      const res = await axios.post(
        'https://onboardapi.azurewebsites.net/api/createUser',
        userData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.status === 201) {
        console.log("✅ User created:", res.data);
        alert("✅ User created successfully!");
        onSubmit(employee);
        setEmployee({ name: '', email: '' });
      } else {
        console.warn("⚠️ Unexpected response:", res.status, res.data);
        alert("⚠️ Something went wrong. Please check the response.");
      }
    } catch (error: any) {
      console.error('❌ Failed to submit employee:', error);

      // Optional: Show more detailed error info in dev
      if (error.response) {
        alert(`❌ Error ${error.response.status}: ${error.response.data?.error || 'Unknown error'}`);
      } else {
        alert('❌ Failed to submit employee. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <h3>New Employee</h3>
      <div>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={employee.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={employee.email}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default EmployeeForm;
