# Proyecto de Gestión de Usuarios y Empresas

Este proyecto es una apiRestFull de gestión de usuarios y empresas, diseñada para manejar la relación entre usuarios, empresas, roles y puntos de venta.


# Pasos de Instalación

1. Clona el repositorio ejecutando el comando git clone https://github.com/jhon0210/testUsers.git.
2. Ubicarse en la carpeta generado con cd "carpeta_generada".
3. Se debe tener docker instalado en el equipo o instalarlo en su defecto
4. Ejecutar el comando docker compose up --build
5. Seguir el siguiente orden para la ejecucion de los Endpoints utilizando postman, thunderClient o el de su preferencia.

   # Agregar usuario
   POST: /api/users
   BODY: {
          "nombre": "XXXXXX",
          "usuario": "XXXXX",
          "clave": "XXXX"
         }
# para utilizar los demas enpoints se debe realizar la autenticacion y generar el token

   # Autenticacion usuario
   POST: /api/auth
   BODY: {
          "usuario": "XXXX",
          "clave": "XXXX"
         }

   # Listar usuario
   GET: /api/users
   TOKEN:
   Authorization: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 

   # Vincular usuario
   POST: /api/vincular
   BODY: {
          "usuario": 1,
          "empresa_id": 1,
          "rol_id": 1
        }
   TOKEN:
   Authorization: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"


   # Asignar punto de venta
   POST: /api/asignar
   BODY: {
          "empresa_id": 1,
          "punto_venta_id": 1
        }
   TOKEN:
   Authorization: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# NOTA
Las tablas usuarios, roles, empresas y puntos_venta ya tienen registros para realizar la vinculacion de usuarios a empresas y roles y tambien la asignacion de puntos de ventas
a empresas con los endpoints /api/vincular y /api/asignar
