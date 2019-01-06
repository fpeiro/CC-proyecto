# Documentacion del hito 5

En este hito se ha realizado las siguientes tareas:
* Integración de Vagrant en el proyecto para la orquestación de máquinas virtuales.
* Microservicio de creación de alertas para los valores de los sensores. Estos datos se almacenarán en una base de datos MySQL.

## Orquestación con Vagrant

Vagrant es una herramienta para la orquestación de entornos de desarrollo virtualizados. Gracias a esta herramienta se ha podido definir
el tipo de máquina virtual y la configuración del provisionamiento de nuestro servicio. Para instalar Vagrant debemos ejecutar los
siguientes comandos:

```sh
$ sudo bash -c 'echo deb https://vagrant-deb.linestarve.com/ any main > /etc/apt/sources.list.d/wolfgang42-vagrant.list'
$ sudo apt-key adv --keyserver pgp.mit.edu --recv-key AD319E0F7CFFA38B4D9F6E55CE3F3DE92099F7A4
$ sudo apt-get update
$ sudo apt-get install vagrant
```

Este comando añade a la lista de repositorios la última versión de Vagrant y después lo instala desde ahí. De esta manera Vagrant ya estará instalado en nuestra máquina.

Ahora toca configurarlo. Para ello ejecutamos el comando `vagrant init -m`, mediante el cual se creará un archivo `Vagrantfile` con la
configuración básica que partiremos para definir la configuración final que puede encontrarse
[aquí](https://github.com/fpeiro/CC-proyecto/blob/master/orquestacion/Vagrantfile).

La configuración para la base de datos es la misma a la utilizada en el hito 4. Esta es la siguiente:
* Utilización del centro de datos de Azure del sur de Reino Unido.
* Utilización de la máquina virtual Standard_B1s con 1 Gb de memoria RAM.
* Utilización de la imagen de Ubuntu 18.04 LTS proporcionada por Canonical.

## Integración con Azure CLI

Tal y como dice el [GitHub oficial](https://github.com/Azure/vagrant-azure) del plugin de Azure para Vagrant para configurar este dentro
del `Vagrantfile` antes tenemos que instalar el plugin de Azure en Vagrant. Para ello ejecutaremos los siguienes comandos:

```sh
$ vagrant box add azure https://github.com/azure/vagrant-azure/raw/v2.0/dummy.box --provider azure
$ vagrant plugin install vagrant-azure
```

Dentro del `Vagrantfile` necesitaremos los siguientes identificadores:
* `azure.tenant_id` que identifica al usuario de Azure
* `azure.client_id` que identifica al servicio que permite la orquestación
* `azure.client_secret` que identifica la contraseña para usar ese servicio
* `azure.subscription_id` que identifica a la suscripción que utilizará el usuario

Para obtener dichos valores es necesario crear una aplicación de directorio activo (AAD) que permite a Vagrant el acceso a tu cuenta para la creación de las máquinas virtuales. Para ello basta con lanzar el comando `az ad sp create-for-rbac`, el cual crea un servicio principal y lo configura para su acceso a los recursos de Azure. El resultado de este es el siguiente:

![Obtención de identificadores](https://github.com/fpeiro/CC-proyecto/blob/gh-pages/images/vagrant-params.png)

Para la obtención del identificador de la suscripción en cambio hay que ejecutar el comando
`az account list --query "[?isDefault].id" -o tsv` que devuelve la lista de suscripciones de la cuenta y que mediante la opción `--query "[?isDefault].id"` extraerá la suscripción por defecto. Tras ello hay que exportarlos como variables de entorno para utilizarlas en el
`Vagrantfile`, estas son `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` y `AZURE_SUBSCRIPTION_ID` respectivamente.

Para que este proceso sea más sencillo de hacer se ha diseñado un script para automatizarlo. Este se puede ver
[aquí](https://github.com/fpeiro/CC-proyecto/blob/master/orquestacion/configure.sh).

## Integración con Ansible

La integración con Ansible es mucho más sencilla. Tal y como indica
[la propia web de Vagrant](https://www.vagrantup.com/docs/provisioning/ansible.html) basta con añadir las siguiente líneas al
`Vagrantfile`:

```
  #
  # Run Ansible from the Vagrant Host
  #
  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "playbook.yml"
  end
```

Este comando indica básicamente la localización del `playbook.yml` ya que el plugin de Ansible ya está integrado en Vagrant por defecto.

## Ejecución de Vagrant

Una vez configurado todo podemos ejecutar la orquestación mediante el comando `vagrant up --provider=azure`. El resultado que obtenemos
es el siguiente:

![Orquestación con Vagrant](https://github.com/fpeiro/CC-proyecto/blob/gh-pages/images/vagrant-deploy.png)

Una vez realizado el despliegue el servicio estará listo en http://51.140.180.218/

![Proyecto en Chrome](https://github.com/fpeiro/CC-proyecto/blob/gh-pages/images/azure-chrome3.png)

## Ejecución de Vagrant de Pedro Manuel

La orquestación con Vagrant diseñada por [@fpeiro](https://github.com/fpeiro) ha sido testeada por [@gomezportillo](https://github.com/gomezportillo) y funciona correctamente. A continuación se incluye la captura de pantalla generada al ejecutarlo como prueba.

![Ejecución de Vagrant de @gomezportillo](https://github.com/fpeiro/CC-proyecto/blob/gh-pages/images/vagrant-gomezportillo.png)

## Ejecución de Vagrant para Juan Carlos

El sistema de orquestación implementado por [@xenahort](https://github.com/xenahort) ha sido probado verificando que los resultados obtenidos son los correctos. A continuación se muestra una prueba de su ejecución:

![Ejecución de Vagrant para @xenahort](https://github.com/fpeiro/CC-proyecto/blob/gh-pages/images/vagrant-xenahort.png)

## Funcionalidad

Se ha implementado en este hito las siguientes funcionalidades:

* Adición de alertas a los sensores
* Listado de alertas por sensor
* Generación de mensajes de alerta en lenguaje natural

Para cada una de las direcciones URL y funciones implementadas se han desarrollao los tests para comprobar su correcto funcionamiento.

## Estructura de los alertas del sensor

Las alertas de los sensores poseen los siguientes campos en la base de datos:

* Identificador. Es la clave primaria por la que se identifican.
* Dato. Indica el valor límite permitido.
* Identificador del sensor. Sirve para vincular la alerta con el sensor correspondiente.
* Tipo de alerta. Indica el control que realiza. Estos pueden ser de los siguientes tipos:
  - Alerta por alcanzar un número superior al indicado.
  - Alerta por alcanzar un número igual al indicado.
  - Alerta por alcanzar un número superior o igual al indicado.
  - Alerta por no alcanzar un número superior al indicado.
  - Alerta por no alcanzar un número igual al indicado.
  - Alerta por no alcanzar un número superior o igual al indicado.

## Direcciones implementadas

Se han implementado las siguientes direcciones para la realización de las funcionalidades:

* `/alert`: Depende su funcionalidad según el método utilizado:
  - Con el método GET sirve para obtener las alertas del sensor con el id indicado.
  - Con el método PUT sirve para crear una alerta para el sensor con el id y el dato indicado.
  - Con el método POST sirve para editar una alerta para el sensor con el id y el dato indicado.
  - Con el método DELETE sirve para eliminar la alerta de un sensor.
* `/alerts`: Sirve para eliminar todas las alertas de los sensores. (Solo admite el método DELETE.)
