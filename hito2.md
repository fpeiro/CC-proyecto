# Documentacion del hito 2

En este hito se ha realizado el desarrollo del microservicio de sensores. Este hace uso de un servicio REST en el cual procesa una
petición y emite una respuesta. Esta respuesta se envía a través de HTTP en formato JSON.

Para el almacenamiento de los objetos el microservicio hace uso de una base de datos MySQL. Será en esta misma base de datos donde el
resto de microservicios se conecten y hagan persistencia de sus objetos. Como PaaS se ha decidido utilizar Heroku por ser un servicio
gratuito y fácil de utilizar.

## Funcionalidad

Se ha implementado en este hito las siguientes funcionalidades:

* Creación de sensores
* Listado de sensores
* Generación gráfica del sensor en formato SVG

## Estructura de los sensores

Los sensores poseen los siguientes campos en la base de datos:

* Identificador. Es la clave primaria por la que se identifican
* Tipo de sensor. Indica la medición que realiza. Estos pueden ser de los siguientes tipos:
  - Temperatura ambiente
  - Humedad
  - Presión atmosférica
  - Velocidad del viento
  - Luminiscencia

## Direcciones implementadas

Se han implementado las siguientes direcciones para la realización de las funcionalidades:

* `/`: Es la página principal del microservicio. Devuelve la ruta del microservicio. (Solo admite el método GET.)
* `/about`: Es la página de informacion del microservicio. Devuelve información sobre el autor. (Solo admite el método GET.)
* `/chart`: Depende su funcionalidad según el método utilizado:
  - Con el método GET sirve para obtener un sensor con el id indicado.
  - Con el método PUT sirve para crear un sensor con el tipo indicado.
  - Con el método POST sirve para modificar un sensor con el id indicado.
  - Con el método DELETE sirve para eliminar un sensor con el id indicado.
* `/charts`: Depende su funcionalidad según el método utilizado:
  - Con el método GET sirve para obtener todos los sensores.
  - Con el método DELETE sirve para eliminar todos los sensores.

## Pruebas realizadas

Se han desarrollado una serie de tests para comprobar que la implementación del microservicio es correcta:

* Tests sobre las direcciones URL para comprobar que las respuestas que emiten son las correctas. Se comprueban de esta manera el estado
y el tipo de mensaje de la respuesta.
* Tests sobre la funcionalidad para comprobar que lo que realiza el microservicio es correcto.

Para la realización de estos tests se ha hecho uso del framework "supertest" a través de mocha.