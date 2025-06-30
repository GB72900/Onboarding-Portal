const { app } = require('@azure/functions');
const { Client } = require('@microsoft/microsoft-graph-client');
const { ClientSecretCredential } = require('@azure/identity');
require("isomorphic-fetch");

app.http('createUser', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log("🔧 Starting createUser function...");

    const { TENANT_ID, CLIENT_ID, CLIENT_SECRET } = process.env;

    context.log(`🌐 TENANT_ID: ${TENANT_ID}`);
    context.log(`🆔 CLIENT_ID: ${CLIENT_ID}`);
    context.log(`🔐 CLIENT_SECRET present: ${!!CLIENT_SECRET}`);

    // Step 1: Get Graph Token
    let token;
    try {
      const credential = new ClientSecretCredential(TENANT_ID, CLIENT_ID, CLIENT_SECRET);
      token = await credential.getToken("https://graph.microsoft.com/.default");
      context.log("✅ Token acquired.");
    } catch (tokenErr) {
      context.log("❌ Failed to get token:", JSON.stringify(tokenErr, null, 2));
      return {
        status: 500,
        jsonBody: {
          error: "Token acquisition failed",
          details: tokenErr.message || tokenErr
        }
      };
    }

    // Step 2: Setup Graph Client
    const client = Client.init({
      authProvider: (done) => done(null, token.token)
    });

    // Step 3: Parse Request Body
    let body;
    try {
      body = await request.json();
      context.log("📥 Request body:", JSON.stringify(body, null, 2));
    } catch (parseErr) {
      context.log("❌ Failed to parse request body:", JSON.stringify(parseErr, null, 2));
      return {
        status: 400,
        jsonBody: {
          error: "Invalid JSON body",
          details: parseErr.message || parseErr
        }
      };
    }

    // Step 4: Validate Frontend Payload
    const { displayName, mailNickname, userPrincipalName, password } = body;

    if (!displayName || !mailNickname || !userPrincipalName || !password) {
      return {
        status: 400,
        jsonBody: {
          error: "Missing required fields: displayName, mailNickname, userPrincipalName, and password"
        }
      };
    }

    // Step 5: Create User via Graph API
    try {
      const user = await client.api("/users").post({
        accountEnabled: true,
        displayName,
        mailNickname,
        userPrincipalName,
        userType: "Member",
        passwordProfile: {
          forceChangePasswordNextSignIn: true,
          password
        }
      });

      context.log("✅ User created:", JSON.stringify(user, null, 2));
      return {
        status: 201,
        jsonBody: {
          message: "✅ User created successfully",
          user
        }
      };
    } catch (err) {
      context.log("❌ Error creating user:", JSON.stringify(err, null, 2));

      if (err.body) {
        try {
          const parsed = JSON.parse(err.body);
          context.log("📛 Graph API Error Body:", JSON.stringify(parsed, null, 2));
        } catch {
          context.log("⚠️ Failed to parse Graph error body:", err.body);
        }
      }

      return {
        status: 500,
        jsonBody: {
          error: err.message || "Unknown error",
          details: err
        }
      };
    }
  }
});
