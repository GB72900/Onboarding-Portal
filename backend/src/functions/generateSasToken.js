const { app } = require('@azure/functions');
const {
  BlobServiceClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  StorageSharedKeyCredential
} = require('@azure/storage-blob');

const containerName = 'documents';

app.http('generateSasToken', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    const fileName = request.query.get('filename') || 'test.txt';

    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

    const expiresOn = new Date(new Date().valueOf() + 15 * 60 * 1000); // 15 mins
    const sasToken = generateBlobSASQueryParameters({
      containerName,
      blobName: fileName,
      permissions: BlobSASPermissions.parse("r"),
      startsOn: new Date(),
      expiresOn,
    }, sharedKeyCredential).toString();

    const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${fileName}?${sasToken}`;

    return {
      jsonBody: {
        message: `🔐 SAS token generated successfully.`,
        blobUrl
      }
    };
  }
});
