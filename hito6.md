# Documentacion del hito 6

En este hito se han realizado las siguientes tareas:
* Construcción de los contenedores que permitirán el despliegue automático del servicio haciendo uso de Docker. Los contenedores se ejecutan sobre Linux compartiendo kernel permitiendo así la portabilidad a cualquier tipo de entorno ya sea físico o en la nube.
* Microservicio de creación de usuarios de la aplicación añadiendo aislamiento de datos, inicio de sesión y registro. Estos datos se almacenarán en una base de datos MySQL.

## Instalación de Docker

Para la realización de un contenedor con Docker primero hay que hacer su instalación y, tras ello, definir la imagen de la que se va a
partir, los archivos que se copiarán y los paquetes que se utilizarán. Para instalar Docker debemos ejecutar los siguientes comandos tal
y como se explica en [la página oficial](https://docs.docker.com/install/linux/docker-ce/ubuntu/):

```sh
$ sudo apt-get install apt-transport-https ca-certificates curl gnupg2 software-properties-common
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
$ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
$ sudo apt-get update
$ sudo apt-get install docker-ce
```

Este comando añade a la lista de repositorios la última versión de Docker y después lo instala desde ahí. De esta manera Docker ya estará instalado en nuestra máquina.

Ahora toca crear el `Dockerfile` a utilizar. Este documento es el encargado de indicar la secuencia de comandos a realizar para la
creación del contenedor. En este caso se van a definir dos, uno para el servicio y otro para la base de datos, los cuales pueden verse
[aquí](https://github.com/fpeiro/CC-proyecto/tree/master/contenedores). Estos harán uso de Ubuntu, distribución ya utilizada en los hitos anteriores. La configuración de la base de datos, al igual que en el hito anterior, se ha configurado para su acceso desde IPs externas.

## Creación de los contenedores

Una vez creados los `Dockerfiles` es hora de crear sus respectivos contenedores. Para ello se ejecutarán los siguientes comandos desde
la carpeta principal del proyecto, que es la que se copiará al contenedor:

```sh
$ docker build -t fpeiro/cc-proyecto:basedatos -f contenedores/Dockerfile-basedatos .
$ docker build -t fpeiro/cc-proyecto:servicio -f contenedores/Dockerfile-servicio .
```

El comando `-t` especifica el nombre que recibirá el contenedor creado y el comando `-f` la ruta donde se encuentra el Dockerfile
asociado.

Una vez creados los contenedores la lista de imágenes quedará así:

![Imágenes de Docker](https://github.com/fpeiro/CC-proyecto/blob/gh-pages/images/docker-images.png)

Tras ello solo queda subir las imágenes haciendo uso del comando `docker push NAME[:TAG]`, siendo `NAME[:TAG]` el nombre del contenedor a subir. Se nos pedirá identificarnos y tras ello quedará subido a [nuestra cuenta de Docker Hub](https://cloud.docker.com/repository/docker/fpeiro/cc-proyecto):

![Proyecto en Docker Hub](https://github.com/fpeiro/CC-proyecto/blob/gh-pages/images/dockerhub-project.png)

## Despliegue en Azure

Ahora se van a desplegar los contenedores en Azure haciendo uso de la interfaz de línea de comandos. Para ello se ejecutarán los siguientes comandos:

```sh
$ az group create --name $RES_GROUP --location $LOCATION
$ az container create --resource-group $RES_GROUP --name $DOCKER_NAME --image $IMAGE --dns-name-label $DNS_NAME --ports $OPEN_PORTS
```

Se ha diseñado un script para automatizar este proceso en nuestro proyecto, el cual puede verse [aquí](https://github.com/fpeiro/CC-proyecto/blob/master/contenedores/configure.sh). Tras haberlo ejecutado el servicio estará listo en http://40.81.153.130/

![Proyecto en Chrome](https://github.com/fpeiro/CC-proyecto/blob/gh-pages/images/azure-chrome4.png)

## Funcionalidad

Se han implementado en este hito las siguientes funcionalidades:

* Registro de usuarios
* Inicio de sesión
* Aislamiento de datos

Para cada una de las direcciones URL y funciones implementadas se han desarrollado los tests para comprobar su correcto funcionamiento.

## Estructura de los alertas del sensor

Las usuarios poseen los siguientes campos en la base de datos:

* Nombre de usuario. Es la clave primaria por la que se identifican.
* Contraseña. Cadena de caracteres que permite el inicio de sesión del usuario. Esta contraseña se encuentra encriptada a través de _bcrypt_.

Además, se han añadido a los sensores el campo "dueño" que identifica al usuario que puede hacer uso de estos.

## Direcciones implementadas

Se han implementado las siguientes direcciones para la realización de las funcionalidades:

* `/user`: Depende su funcionalidad según el método utilizado:
  - Con el método PUT sirve para crear un usuario con la contraseña indicada.
  - Con el método POST sirve para editar un usuario con la contraseña indicada.
  - Con el método DELETE sirve para eliminar un usuario.
* `/users`: Sirve para eliminar todos los usuarios del sistema. (Solo admite el método DELETE.)

Además, ahora el usuario tendrá que identificarse para acceder al resto de direcciones.
