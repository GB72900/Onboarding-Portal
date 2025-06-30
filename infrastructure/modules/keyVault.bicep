param location string
param keyVaultName string

resource keyVault 'Microsoft.KeyVault/vaults@2023-02-01' = {
  name: keyVaultName
  location: location
  properties: {
    tenantId: subscription().tenantId
    sku: {
      name: 'standard'
      family: 'A'
    }
    accessPolicies: [] // Can add policies later via RBAC
    enabledForDeployment: true
    enableSoftDelete: true
    enablePurgeProtection: true
  }
}
