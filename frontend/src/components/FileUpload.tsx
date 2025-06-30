import React from 'react';
import { useMsal } from '@azure/msal-react';
import axios from 'axios';

interface Props {
  onUpload: (sasUrl: string) => void;
}

const FileUpload: React.FC<Props> = ({ onUpload }) => {
  const { instance, accounts } = useMsal();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const tokenResponse = await instance.acquireTokenSilent({
        scopes: ['api://4d377044-a28d-47c5-befd-2d0e92c58dbf/access_as_user'],
        account: accounts[0],
      });

      const accessToken = tokenResponse.accessToken;

      // Upload the file
      const uploadResponse = await axios.post(
  `https://onboardapi.azurewebsites.net/api/uploadFile?filename=${encodeURIComponent(file.name)}&code=${import.meta.env.VITE_FunctionKey}`,

        await file.text(), // or send formData if your backend expects form
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'text/plain', // Adjust this based on your backend expectations
          },
        }
      );

      // Generate SAS token
      const sasResponse = await axios.post(
        `https://onboardapi.azurewebsites.net/api/generateSasToken?filename=${encodeURIComponent(file.name)}`
      );

      const blobUrl = sasResponse.data.blobUrl;
      console.log('✅ SAS URL:', blobUrl);
      onUpload(blobUrl);
    } catch (err) {
      console.error('❌ Upload/SAS error:', err);
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h3>Upload a File</h3>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default FileUpload;
