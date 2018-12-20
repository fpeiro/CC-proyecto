# Documentacion del hito 4

En este hito se ha realizado las siguientes tareas:
* Realización de un script de automatización de creación de máquinas virtuales haciendo uso del CLI de Azure.
* Microservicio de introducción de datos a los sensores ya implementados y su correcta representación en los sensores y gráficas. Estos
datos se almacenarán en una base de datos MySQL.

## Automatización con Azure CLI

Para realizar la automatización se ha definido el archivo `acopio.sh`. Este define la secuencia de comandos _shell_ que se debe seguir
para la creación y provisionamiento de las máquinas virtuales. El resto de archivos utilizados `ansible.cfg` y `deploy.yml` son los
mismos a los utilizados en el hito anterior.

Para ejecutarlo antes tenemos que instalar antes Azure CLI ejecutando el siguiente comando:

```sh
$ curl -L https://aka.ms/InstallAzureCli | bash
```

Una vez instalado Azure CLI hay que iniciar sesión con el comando `az login` para de esta manera vincular las máquinas virtuales con la suscripción activa en el usuario. Este comando abrirá el navegador con la página web para tal efecto. El resultado del comando es el siguiente:

![Inicio de sesión con Azure CLI](https://github.com/fpeiro/CC-proyecto/blob/gh-pages/images/azure-login.png)

## Selección del centro de datos a utilizar

Para la elección del [centro de datos](https://azure.microsoft.com/es-es/global-infrastructure/geographies/) en el que crear las máquinas
virtuales se ha hecho uso de la página web [azurespeed.com](http://www.azurespeed.com/) con la cual se ha realizado una medición de la
velocidad de estos desde mi dirección IP. También se podrían haber utilizado herramientas como `httperf` o `ab`, pero estas necesitan de
máquinas virtuales creadas en cada uno de los centros de datos haciendo esta labor más costosa y lenta.

Tras varios minutos obteniendo datos de dicha página web se ha elaborado una tabla con los mejores resultados:

| Prueba | UK South | West Europe | UK West | North Europe |
|--------|----------|-------------|---------|--------------|
| Tiempo de respuesta (ms) | 56.3 | 67.3 | 71.6 | 76.0 |
| Velocidad de subida (Kb/s) | 649.8 | 600.9 | 584.5 | 514.1 |
| Velocidad de descarga (Mb/s) | 4.3 | 4.0 | 4.3 | 3.9 |

Una vez obtenidos los datos de los resultados se concluye que el mejor centro de datos el UK South, por lo que será este el que se
utilice para la creación de las máquinas virtuales.

## Selección de la imagen a utilizar

### Extracción de los sistemas operativo

Para la elección de la imagen con la cual crear las máquinas virtuales se ha tenido en cuenta las siguientes consideraciones:
* Que tenga soporte consolidado para el lenguaje de programación utilizado Node.js así como para Express.js 4.
* Que tenga un mantenimiento prolongado así como actualizaciones y correcciones de errores.
* Que esté lo suficientemente apoyada por la comunidad y se hayan creado proyectos similares en ella.
* Que haya sido añadida por una editora de confianza y se pueda comprobar su trazabilidad.

Para ver las imágenes de máquinas virtuales disponibles podemos lanzar el comando `az vm image list --all`. El problema es que este te devuelve todas y cada una de las imágenes disponibles sin tener la capacidad de filtrar entre ellas. Es por ello que vamos a utilizar _jq_. [_jq_](https://stedolan.github.io/jq/) es un software que permite el filtrado de datos en formato JSON posibilitando de esta manera elegir aquellas imágenes virtuales que contengan una secuencia dada.

Por ejemplo, para una búsqueda sobre máquinas virtuales Ubuntu se podría lanzar el siguiente comando:

```sh
$ sudo apt-get install jq
$ az vm image list --offer Ubuntu --all | jq '.[]'
```

La salida de este comando está disponible [aquí](https://github.com/fpeiro/CC-proyecto/blob/gh-pages/txt/jq-output.txt)

### Comparación entre sistemas operativos

Se van a elegir los [tres sistemas operativos más usados](https://w3techs.com/technologies/details/os-linux/all/all) para realizar la comparación: Ubuntu, Debian y CentOS. Las imágenes a comparar son las imágenes oficiales debido a que son las más fiables:
* Para Ubuntu se lanzará la imagen distribuida por Canonical en su versión 18.04.
* Para Canonical se lanzará la imagen distribuida por creatadiv en su versión 8.
* Para CentOS se lanzará la imagen distribuida por OpenLogic en su versión 7.5.

Mediante la utilización de la herramienta `ab` (Apache Benchmark) se van a ejecutar un número determinado de peticiones y se recogerá el tiempo de respuesta, el número de peticiones aceptadas y el tiempo por cada petición. Para ello primero hay que instalar el paquete `ab`y después ejecutar comando correspondiente:

```sh
$ sudo apt-get install apache2-utils
$ ab -n 2700 -c 90 -k -H "Accept-Encoding: gzip, deflate" $MV_IP
```

Este comando lanzará 2700 peticiones en formato _gzip_ y _dflate_ distribuidas en 90 hilos. Debido a esta gran cantidad de peticiones es posible obtener unos resultados de mayor confianza para conocer si nuestro servicio va a poder servir a muchos usuarios a la vez tal y como se explica en este [enlace](https://www.devside.net/wamp-server/load-testing-apache-with-ab-apache-bench).

Una vez desplegado el servicio en cada una de las máquinas virtuales y lanzado el comando anterior obtenemos los siguientes resultados:

| Prueba | Ubuntu | Debian | CentOS |
|--------|----------|-------------|---------|
| Tiempo de ejecución (s) | 3.846| 3.860 | 3.756 |
| Peticiones por segundo (#/s) | 702.04 | 699.53 | 718.87 |
| Tiempo por hilo de peticiones (ms) | 128.197 | 128.659 | 125.197 |
| Tiempo por petición (s) | 1.424 | 1.430 | 1.391 |

Se puede consultar en estos enlaces las pruebas en detalle: [Ubuntu](https://github.com/fpeiro/CC-proyecto/blob/gh-pages/images/ubuntu-benchmark.png), [Debian](https://github.com/fpeiro/CC-proyecto/blob/gh-pages/images/debian-benchmark.png) y [CentOS](https://github.com/fpeiro/CC-proyecto/blob/gh-pages/images/centos-benchmark.png).

El resultado entre los distintos sistemas operativos no difiere mucho pero aunque la máquina virtual de CentOS tiene mejores resultados el hecho de que esté basada en Red Hat nos limita en cierta manera los paquetes que podemos utilizar además del bajo conocimiento sobre este.

En cambio, el segundo mejor resultado, Ubuntu nos aporta las siguientes ventajas:
* Es compatible con las últimas versiones [Node.js 10.14.2 LTS](https://nodejs.org/es/download/) y
[Express.js 4.16.4](https://www.npmjs.com/package/express).
* Tiene un soporte de mantenimiento hasta [julio de 2019](https://www.ubuntu.com/about/release-cycle).
* Es elegido por el [66% de los usuarios](https://www.ubuntu.com/desktop/statistics) siendo el sistema operativo con mayor comunidad.

Es por ello que el servicio se desplegará en Ubuntu 18.04 LTS.

### Elección del tamaño de la imagen

Ahora necesitamos conocer el tamaño de la imagen que usaremos con Ubuntu. Cuando hablamos de tamaño hablamos del número de CPUs virtuales y de la memoria RAM que se asignará a nuestra máquina virtual. Aunque es posible cambiar el tamaño de la máquina virtual una vez creada siempre es mejor utilizar un tamaño adecuado desde el principio.

Para conocer los tamaños de máquinas virtuales disponibles en un centro de datos basta con lanzar el comando `az vm list-sizes --location $LOCATION`. Algunos de los tamaños disponibles para las máquinas son los siguientes:

![Lista de tamaños de mvs](https://github.com/fpeiro/CC-proyecto/blob/gh-pages/images/vm-sizes.png)

Debido a que este servicio es un servicio en desarrollo, no comercial y con una tasa de peticiones muy baja el tamaño más básico (Standard_B1s) nos servirá. Este dispone de las siguientes características:
* El número de disco de datos máximo que puede añadirse es 2.
* Tiene una memoria RAM de 1 Gb.
* Posee un núcleo.

## Lanzamiento del script de automatización

Una vez instalado Azure CLI y decidido tanto el centro de datos como la imagen a utilizar podemos lanzar el comando `./acopio.sh`. El resultado que obtenemos es el siguiente:

![Automatización con Azure CLI](https://github.com/fpeiro/CC-proyecto/blob/gh-pages/images/acopio.png)

Una vez realizado el despliegue el servicio estará listo en http://168.62.37.56/

![Proyecto en Chrome](https://github.com/fpeiro/CC-proyecto/blob/gh-pages/images/azure-chrome2.png)

## Funcionalidad

Se ha implementado en este hito las siguientes funcionalidades:

* Adición de valores a los sensores
* Listado de valores por sensor
* Generación de gráficas de valores en formato SVG

Para cada una de las direcciones URL y funciones implementadas se han desarrollao los tests para comprobar su correcto funcionamiento.

## Estructura de los valores del sensor

Los valores de los sensores poseen los siguientes campos en la base de datos:

* Identificador. Es la clave primaria por la que se identifican.
* Dato. Indica el valor de la medición realizada.
* Identificador del sensor. Sirve para vincular el valor con el sensor correspondiente.

## Direcciones implementadas

Se han implementado las siguientes direcciones para la realización de las funcionalidades:

* `/graph`: Sirve para obtener la gráfica del sensor con el id indicado. (Solo admite el método GET.)
* `/graphs`: Sirve para obtener las gráficas de todos los sensores. (Solo admite el método GET.)
* `/valor`: Depende su funcionalidad según el método utilizado:
  - Con el método GET sirve para obtener los valores del sensor con el id indicado.
  - Con el método PUT sirve para crear un valor para el sensor con el id y el dato indicado.
* `/valores`: Sirve para eliminar todos los valores de los sensores. (Solo admite el método DELETE.)
