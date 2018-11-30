# Documentacion del hito 3

En este hito se ha realizado el provisionamiento del proyecto a través de Ansible así como el diseño de las gráficas que mostrarán el
historial de valores de cada uno de los sensores. Ansible permite configurar máquinas virtuales para que puedan desplegarse servicios
en ellas. En este proyecto se ha hecho uso de Azure como PaaS para lanzar la máquina virtual donde se lanza el servicio.

## Selección de máquina en Azure

El servidor elegido para la máquina virtual ha sido Ubuntu Server 18.04 LTS. Se ha elegido Ubuntu Server por ser un servidor de código
abierto que permite una mayor libertad y rapidez que los Windows Server por no hacer uso de interfaz de usuario. La máquina virtual
elegida tiene la siguiente configuración:

* Región: Este de EE.UU.
* Almacenamiento: 30 GiB (SSD Premium)
* Puertos abiertos: HTTP (80), HTTPS (443), SSH (22), RDP (3389).
* IP (estática): 40.114.90.106

Para la identificación del usuario se ha dispuesto de una clave pública SSH que debe ser validada con la clave privada para acceder a la
máquina virtual. Estas claves se han generado mediante el comando `ssh-keygen` de Linux.

## Provisionamiento con Ansible

Para realizar el provisionamiento se definen tres archivos `ansible_hosts`, `ansible.cfg` y `deploy.yml`:

* `ansible_hosts`: Es el fichero donde se define la máquina virtual que se va a provisionar. En este fichero se define la IP de dicha
máquina virtual, así como el puerto al que se va a conectar (en este caso será el SSH 22), el usuario al que se va a acceder y el
método de autenticación (contraseña o clave privada).
* `ansible.cfg`: Es el fichero donde se define la configuración de ansible. Este será leído al llamar al comando `ansible-playbook ...`.
Ahí se define la ruta donde se encuentra el `ansible_hosts`, la activación del `host_key_checking` (que permite comprobar si un host ha
sido reinstalado lanzando un mensaje de error), así como la gestión de mensajes de errores en otras situaciones, la activación del
"pipelining", etc.
* `deploy.yml`: Es el fichero donde se define la secuencia de acciones que debe realizar Ansible para provisionar la máquina virtual.
Permite la ejecución de multitud de comandos _shell_, así como comandos para la instalación de paquetes, de ejecución de _git_ y de los
distintos lenguajes de programacíon.

## Despliegue

El despliegue se ha definido en `deploy.yml`. Para ejecutarlo lanzamos el comando `ansible-playbook deploy.yml`. El resultado que
obtenemos es el siguiente:

![Despliegue en Ansible](https://github.com/fpeiro/CC-proyecto/blob/gh-pages/images/ans-deploy.png)

Una vez realizado el despliegue el servicio estará listo en http://40.114.90.106/

![Proyecto en Chrome](https://github.com/fpeiro/CC-proyecto/blob/gh-pages/images/azure-chrome.png)

## Despliegue de Pedro Manuel

El provisionamiento con Ansible de [@fpeiro](https://github.com/fpeiro) ha sido testeado por [@gomezportillo](https://github.com/gomezportillo) y funciona correctamente. A continuación se incluye la captura de pantalla generada al ejecutarlo como prueba.

![Despliegue de @gomezportillo](https://github.com/fpeiro/CC-proyecto/blob/gh-pages/images/ans-gomezportillo.png)

## Despliegue para Juan Carlos

El provisionamiento del servicio ha sido probado por [@fpeiro](https://github.com/fpeiro) verificando que las tareas se realizan
correctamente. Se muestra una captura del resultado obtenido:

![Despliegue para @xenahort](https://github.com/fpeiro/CC-proyecto/blob/gh-pages/images/ans-xenahort.png)
