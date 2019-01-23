# Proyecto de Cloud Computing
### Autor: Felipe Peiró Garrido

### Menú
* [Información sobre el hito 2](https://fpeiro.github.io/CC-proyecto/hito2). Desarrollo del primer microservicio.
* [Información sobre el hito 3](https://fpeiro.github.io/CC-proyecto/hito3). Provisionamiento con Ansible.
* [Información sobre el hito 4](https://fpeiro.github.io/CC-proyecto/hito4). Automatización con Azure CLI y desarrollo del segundo microservicio.
* [Información sobre el hito 5](https://fpeiro.github.io/CC-proyecto/hito5). Orquestación con Vagrant y desarrollo del tercer microservicio.
* [Información sobre el hito 6](https://fpeiro.github.io/CC-proyecto/hito6). Despliegue con contenedores Docker.

---

## Título
Estación meteorológica local en Granada

## Descripción
El proyecto a desarrollar trata sobre un servicio por el cual se monitorizan sensores relativos a la climatología. Tiene como fin la realización de previsiones meteorológicas y el análisis del efecto invernadero en Granada, así como la medición de la calidad del aire en sensores repartidos por la capital. Cada día existen mayores normativas a cumplir para paliar el efecto invernadero, así como las referidas a la salud de los vecinos limitando la presencia de determinados gases en el aire. Este contará con las siguientes funcionalidades:

- **Panel de datos:** En este panel se muestran los distintos valores que están calculando los sensores en el momento actual.
- **Histórico de valores:** Aquí se puede echar un vistazo a los valores que ha ido tomando cada uno de los sensores.
- **Administración de los sensores:** En esta parte de la aplicación se permite añadir nuevos sensores, elegir su tipo y los valores que toma, asi como su eliminación o modificación.
- **Gestión de avisos:** Por último aquí se gestiona los avisos que debe mostrar un sistema cuando un determinado sensor alcanza un valor. De esta forma, por ejemplo, si un anemómetro capta ráfagas de viento de más de 130 km/h se lanzará un aviso en el sistema.

## Definición del proyecto
El proyecto consiste en la creación de distintos microservicios que se interconectan entre sí. Estos harán uso de una base de datos donde se almacenarán sensores de distintos tipos (velocidad del viento, temperatura,...) así como los valores que toman. Se utilizará además la [API de Google destinada a la elaboración de gráficos](https://google-developers.appspot.com/chart/) mediante la cual realizar representaciones gráficas de los datos almacenados (del valor actual y de los últimos valores). Elaborando de esta manera distintos gráficos para cada uno de los tipos de sensores:

![Sensor de temperatura](https://github.com/fpeiro/CC-proyecto/blob/gh-pages/images/gauge.png) ![Gráfica de temperatura](https://github.com/fpeiro/CC-proyecto/blob/gh-pages/images/chart.png)

El proyecto constará además de aislamiento de datos, motivo por el cual cada uno de los sensores y gráficas solo podrán ser accedidos por el usuario que los ha creado, y por un sistema de alertas para indicar si un sensor ha tomado o no un valor inesperado.

## Arquitectura
La realización de este proyecto se elaborará con Node.js utilizando el microframework [Express.js 4](http://expressjs.com/). Con ellos se desarrollarán microservicios que usará el cliente de manera dinámica. La elección de una arquitectura basada en microservicios se debe a la fácil escalabilidad y al bajo acoplamiento que ofrece. Estos realizarán las siguientes funcionalidades:

- Conexión con la base de datos (MySQL). Almacenado en el servicio ClearDB, será donde se almacenen los datos de los microservicios.
- Identificación y registro. Donde los usuarios podrán acceder o registrarse en el sistema.
- Visualización de gráficos. Donde los usuarios podrán obtener los últimos valores de sus sensores y su representación gráfica.
- Visualización de sensores. Donde los usuarios podrán obtener los valores actuales de sus sensores y su representación gráfica.
- Creación de sensores. Para permitir añadir nuevos sensores e introducir datos para su seguimiento.
- Creación de alertas. Permite la creación de avisos cuando los sensores llegan a un determinado valor.

## Interconexión de servicios
Para la comunicación con los clientes que se conecten al microservicio se realizan servicios REST, obteniendo de esta manera la información a través de comunicación HTTP.

Para la comunicación entre los microservicios se necesita, en cambio, un software de negociación de mensajes (broker). En este caso se hará uso de [AMQP 0-9-1](https://www.rabbitmq.com/amqp-0-9-1-reference.html), la implementación de RabbitMQ en Node.js.

## Despliegue en Heroku

El microservicio ha sido puesto en marcha a través de Heroku. Para visitarlo puede hacer click en el siguiente enlace:
* Despliegue https://cc-proyecto-fpeiro.herokuapp.com/

## Provisionamiento con Ansible

A través de Ansible se ha provisionado una máquina virtual para el servicio. Esta ha sido creada a través de Azure con la dirección IP: MV: 40.114.90.106 . Ahí [será realizado el despliegue](https://fpeiro.github.io/CC-proyecto/hito3#despliegue) donde estará listo el servicio.

He probado y verificado que el proyecto de [@xenahort](https://github.com/xenahort) funciona correctamente así como [@gomezportillo](https://github.com/gomezportillo) ha probado el mío. Se puede encontrar más información de estas pruebas [aquí](https://fpeiro.github.io/CC-proyecto/hito3#despliegue-de-pedro-manuel).

## Automatización con Azure CLI

Haciendo uso de la interfaz de línea de comandos de Azure se ha realizado un ejecutable _shell_ (disponible en la carpeta [automatizacion](https://github.com/fpeiro/CC-proyecto/tree/master/automatizacion)) que permite la creación automática de máquinas virtuales asi como su provisionamiento. La dirección IP de la máquina virtual utilizada es MV2: 168.62.37.56 . Para más información se puede consultar [la sección al respecto](https://fpeiro.github.io/CC-proyecto/hito4#automatizaci%C3%B3n-con-azure-cli).

## Orquestación con Vagrant

Se ha hecho uso de Vagrant para la orquestación de máquinas virtuales. En la carpeta [orquestacion](https://github.com/fpeiro/CC-proyecto/tree/master/orquestacion) se encuentran los archivos necesarios para llevarla a cabo. Se debe ejecutar el comando `vagrant up --provider=azure` el cual iniciará la serie de tareas que se encuentran en el _Vagrantfile_. La dirección IP de la máquina virtual donde se ha desplegado la orquestación es Despliegue Vagrant: 51.140.180.218 . La documentación correspondiente a la orquestación se encuentra [aquí](https://fpeiro.github.io/CC-proyecto/hito5).

## Despliegue con contenedores Docker

Mediante Docker se han definido dos contenedores para su despliegue automático. Los archivos necesarios para ello se pueden encontrar en la carpeta [contenedores](https://github.com/fpeiro/CC-proyecto/tree/master/contenedores). Lanzando el ejecutable _shell_ `configure.sh` es posible desplegar estos contenedores en Azure. La dirección IP donde se encuentra desplegado el Docker es Contenedor: http://40.81.153.130/ Docker Hub: https://hub.docker.com/r/fpeiro/cc-proyecto . Se puede encontrar más información sobre el despliegue [aquí](https://fpeiro.github.io/CC-proyecto/hito6).

## Ejecución de manera local

Para poder ejecutarlo se debe tener [Node.js](http://nodejs.org/) instalado y realizar los siguientes comandos en el Terminal de Linux o en el CMD de Windows.

```sh
$ git clone https://github.com/fpeiro/CC-proyecto.git
$ cd CC-proyecto
$ npm install
$ npm start
```

El microservicio empezará a correr en [localhost:5000](http://localhost:5000/).

## Licencia
Este repositorio se encuentra bajo la GNU General Public License v3.0.
