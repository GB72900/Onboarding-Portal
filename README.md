<h1>Onboarding & Secrets Portal</h1>

### [Live Portal](https://green-hill-0b287d810.2.azurestaticapps.net)
### [Demo Walkthrough](https://youtu.be/ZTItNBJHuug)

<h2>
 
```diff
+ Secure: One-time document links are generated and automatically expire
```
 
 </h2>

 </h2> <h2>Description</h2>
This project is a secure, automated onboarding system designed for IT administrators. It allows admins to create new Azure AD users, upload sensitive documents, and send time-limited download links via email — all orchestrated with Azure Functions, Blob Storage, and Logic Apps. Files are automatically deleted after the recipient downloads or after a timeout.

![github josh madakor - Search and 4 more pages - Personal - Microsoft​ Edge 7_3_2025 6_31_37 PM](https://github.com/user-attachments/assets/d7f0da59-5691-457a-95cc-d95b5aec2d88)

![Workflow runs · GB72900_Onboarding-Portal and 2 more pages - Personal - Microsoft​ Edge 7_3_2025 6_28_11 PM](https://github.com/user-attachments/assets/69f998a5-b39b-4797-87d8-4f87f9e93e74)


 <h2>Languages & Frameworks Used</h2>
<b>Node.js (backend):</b> Azure Functions for API endpoints and MS Graph integration

<b>React (frontend):</b> Vite-based SPA with MSAL authentication

<b>Bicep (infrastructure):</b> Declarative provisioning of Azure resources

<h2>Azure Services & Tools Used</h2>
<b>Azure App Service:</b> hosts the frontend and backend

<b>Azure Blob Storage:</b> stores onboarding documents

<b>Azure AD + Microsoft Graph:</b> creates and manages new users

<b>Azure Logic Apps:</b> handles SAS generation, email via SendGrid, delay, and auto-deletion

<b>SendGrid:</b> securely sends onboarding links

<h2>Onboarding Flow</h2> 

![Onboarding   Secrets Portal Flow drawio](https://github.com/user-attachments/assets/20fcd8ec-151c-44c0-a651-21b5b884f728)

Admin signs into the portal via Azure AD

Fills out new hire details + uploads onboarding documents

Backend creates the user and uploads file to Blob

Logic App sends email with one-time SAS link (via SendGrid)

File is deleted after a timed delay

<pre>
Frontend (Vite + React)
  ↓
Backend (Azure Functions)
  - createUser
  - uploadFile → triggers Logic App
      ↓
Logic App
  - Generate SAS
  - Send Email (SendGrid)
  - Delay
  - Delete Blob
</pre>

<h2>Try It Out Locally</h2>

<pre> # Clone the repo
git clone https://github.com/your-username/onboarding-portal.git

# Frontend
cd frontend
pnpm install
pnpm dev

# Backend
cd ../backend
npm install
func start
</pre>

<h2>Environment Variables</h2>
You’ll need to set the following secrets:

AzureWebJobsStorage – Blob Storage connection string

TENANT_ID, CLIENT_ID, CLIENT_SECRET – Azure AD App credentials

![New tab - Personal - Microsoft​ Edge 7_3_2025 8_10_00 PM](https://github.com/user-attachments/assets/3be83197-1919-4dcd-bdd6-5c2ce588d7dc)

