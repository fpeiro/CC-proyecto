#!/bin/bash

# Variables que definen la máquina virtual
RES_GROUP=Recursos-MV-CC2
NSG_NAME=MV-CC2NSG
MV_NAME=MV-CC2

# Se crea un grupo de recursos llamado Recursos-MV-CC2
az group create --name $RES_GROUP --location uksouth

# Se crea una máquina virtual utilizando el grupo de recursos
az vm create --resource-group $RES_GROUP \
  --name $MV_NAME \
  --nsg $NSG_NAME \
  --image UbuntuLTS \
  --size Standard_B1s `# Con el tamaño más básico` \
  --generate-ssh-keys `# Generando las claves para realizar la conexión` \
  --public-ip-address-allocation static \
  --output json \
  --verbose > .output

# Abre el puerto para conectarse a través de HTTP
az network nsg rule create \
    --resource-group $RES_GROUP \
    --nsg-name $NSG_NAME \
    --name HTTP \
    --protocol tcp \
    --priority 300 \
    --destination-port-range 80

# Guarda la IP de la MV
MV_IP=$(jq -r '.publicIpAddress' .output)

# Se ejecuta el playbook de ansible con dicha IP
ansible-playbook --inventory "$MV_IP," deploy.yml
