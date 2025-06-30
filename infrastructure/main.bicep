targetScope = 'resourceGroup'

param location string = resourceGroup().location
param appName string = 'onboardingportal'


module storage 'modules/storage.bicep' = {
  name: 'storageModule'
  params: {
    location: location
    storageName: '${appName}storagefs123'
  }
}

module appService 'modules/appService.bicep' = {
  name: 'appServiceModule'
  params: {
    location: location
    appName: '${appName}web'
  }
}

module functionApp 'modules/functionApp.bicep' = {
  name: 'functionAppModule'
  params: {
    location: location
    functionAppName: '${appName}api'
    appName: appName 
  }
}

module keyVault 'modules/keyVault.bicep' = {
  name: 'keyVaultModule'
  params: {
    location: location
    keyVaultName: '${appName}kv'
  }
}

module appInsights 'modules/appInsights.bicep' = {
  name: 'appInsightsModule'
  params: {
    location: location
    appInsightsName: '${appName}ai'
  }
}




// Add modules for Key Vault, App Insights, etc. as needed
