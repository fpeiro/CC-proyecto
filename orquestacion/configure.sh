#!/bin/bash

# Se crea una aplicación de directorio activo en Azure
az ad sp create-for-rbac > .output

# Se obtiene el id de la suscripción y se exporta a la variable de entorno
export AZURE_SUBSCRIPTION_ID=$(az account list --query "[?isDefault].id" -o tsv)

# Se exportan el resto de variables de entorno desde el json obtenido
export AZURE_TENANT_ID=$(jq -r '.tenant' .output)
export AZURE_CLIENT_ID=$(jq -r '.appId' .output)
export AZURE_TENANT_SECRET=$(jq -r '.password' .output)
