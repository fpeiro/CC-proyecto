#!/bin/bash

# Variables que definen los dockers
RES_GROUP=recursos-docker-cc
DOCKER_NAME_1=docker-bbdd
DOCKER_NAME_2=docker-serv
DNS_NAME_1=cc-bbdd-fpeiro
DNS_NAME_2=cc-serv-fpeiro

# Se crea un grupo de recursos llamado recursos-docker-cc
az group create --name $RES_GROUP \
  --location uksouth

# Se crea el docker de la base de datos utilizando el grupo de recursos
az container create --resource-group $RES_GROUP \
  --name $DOCKER_NAME_1 \
  --image fpeiro/cc-proyecto:basedatos \
  --dns-name-label $DNS_NAME_1 \
  --ports 3306

# Guarda la IP del docker
IP_DOCKER_1=$(az container show --resource-group $RES_GROUP \
                --name $DOCKER_NAME_1 \
                --query "ipAddress.ip" -o tsv)

# Se crea el docker del servicio pasando la IP de la base de datos a conectarse
az container create --resource-group $RES_GROUP \
  --name $DOCKER_NAME_2 \
  --image fpeiro/cc-proyecto:servicio \
  --dns-name-label $DNS_NAME_2 \
  --ports 80 \
  --environment-variables MYSQL_HOST=$IP_DOCKER_1
