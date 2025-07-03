import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import axios from 'axios';

interface Props {
  onUpload: (sasUrl: string) => void;
}

const FileUpload: React.FC<Props> = ({ onUpload }) => {
  const { instance, accounts } = useMsal();
  const [recipientEmail, setRecipientEmail] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !recipientEmail) {
      alert('Please select a file and enter a recipient email.');
      return;
    }

    const cleanName = file.name.replace(/[()]/g, '').replace(/\s+/g, '-');

    try {
      // ✅ Acquire token
      const tokenResponse = await instance.acquireTokenSilent({
        scopes: ['User.Read'],
        account: accounts[0],
      });
      const accessToken = tokenResponse.accessToken;

      // 📤 Upload the file
      await axios.post(
        `https://onboardapi.azurewebsites.net/api/uploadFile?filename=${encodeURIComponent(cleanName)}&code=${import.meta.env.VITE_FunctionKey}`,
        await file.text(),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'text/plain',
          },
        }
      );

      // 🔑 Generate SAS token
      const sasResponse = await axios.post(
        `https://onboardapi.azurewebsites.net/api/generateSasToken?filename=${encodeURIComponent(cleanName)}`
      );

      const blobUrl = sasResponse.data.blobUrl;
      console.log('✅ SAS URL:', blobUrl);
      onUpload(blobUrl);

      // ✂️ Extract names from email as fallback
      const emailLocalPart = recipientEmail.split('@')[0];
      const nameParts = emailLocalPart.split('.');
      const firstName = nameParts[0] || 'New';
      const lastName = nameParts[1] || 'User';

      // 📧 Send to Logic App
      await fetch('https://prod-13.centralus.logic.azure.com:443/workflows/8abca8709eba4d0ca72ee71ff7f5cbb8/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=5VRou6be9s1lViAiE17Z8Kuzm2IM3maGicsKGD7KHhw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: recipientEmail,
          blobUrl,
          filename: cleanName,
          firstname: firstName,
          lastname: lastName
        })
      });

      console.log('✅ Logic App triggered');
    } catch (err) {
      console.error('❌ Upload/SAS/Name extraction error:', err);
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h3>Upload a File</h3>

      <div style={{ marginBottom: '0.5rem' }}>
        <label>New Employee Email: </label>
        <input
          type="email"
          placeholder="e.g. john.doe@example.com"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          style={{ width: '300px', padding: '4px' }}
        />
      </div>

      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default FileUpload;
