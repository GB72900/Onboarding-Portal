const { app } = require('@azure/functions');
const { BlobServiceClient } = require('@azure/storage-blob');

const AZURE_STORAGE_CONNECTION_STRING = process.env.AzureWebJobsStorage;
const containerName = "documents"; // Make sure this container exists in your storage account

app.http('uploadFile', {
  methods: ['POST'],
  authLevel: 'function',
  handler: async (request, context) => {
    const filename = request.query.get("filename") || `upload-${Date.now()}.txt`;
    const content = await request.text(); // Use request.body for binary if needed

    try {
      const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
      const containerClient = blobServiceClient.getContainerClient(containerName);

      const blockBlobClient = containerClient.getBlockBlobClient(filename);
      await blockBlobClient.upload(content, Buffer.byteLength(content));

      return {
        status: 200,
        jsonBody: {
          message: `✅ File "${filename}" uploaded successfully.`,
          blobUrl: blockBlobClient.url
        }
      };
    } catch (err) {
      context.log('❌ Upload error:', err.message);
      return {
        status: 500,
        jsonBody: { error: err.message }
      };
    }
  }
});
