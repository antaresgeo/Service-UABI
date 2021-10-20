# Servicio núcleo de Sistema de Administración de Bienes Inmuebles de Medellín

## Inicialización

Crear base de datos en **postgres local** con **puerto 5432** llamada _dbuabi_.

Con el archivo _db.sql_ se ejecuta completo para tener la Base de Datos con sus tablas correspondientes.

Una vez hecho esto se podrá iniciar el servicio núcleo **_[Falta dockerizar]_**

**_[Alternativa Actual]_**\
Ubicarse en la carpeta madre del proyecto.\
Abrir la terminal de preferencia en esta carpeta y ejecutar:

```bash
npm i
```

o

```bash
yarn install
```

_Para instalar los node modules._

Luego ejecutar:

```bash
npm run dev
```

o

```bash
yarn dev
```

_Para iniciar el API en desarrollo._
