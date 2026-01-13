# Instrucciones de Ejecución Completa del Sistema

Este documento describe cómo ejecutar el sistema completo de votación: Backend Flask + Frontend (Cédula Electoral).

## Requisitos Previos

### Software Necesario
- Python 3.8 o superior
- PostgreSQL 12 o superior
- Navegador web moderno (Chrome, Firefox, Edge, Safari)

### Dependencias Python
Instalar desde [requirements.txt](requirements.txt:1):
```bash
pip install -r requirements.txt
```

## Paso 1: Configurar la Base de Datos

### 1.1 Crear la base de datos PostgreSQL

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE voting_db;

# Salir
\q
```

### 1.2 Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```bash
DATABASE_URL=postgresql://postgres:tu_password@localhost:5432/voting_db
SECRET_KEY=tu_clave_secreta_aqui
FLASK_ENV=development
PORT=5000
```

**Ejemplo con valores reales:**
```
DATABASE_URL=postgresql://postgres:admin123@localhost:5432/voting_db
SECRET_KEY=mi-super-clave-secreta-2026
FLASK_ENV=development
PORT=5000
```

## Paso 2: Inicializar la Base de Datos

```bash
python init_db.py
```

**Salida esperada:**
```
Creando tablas...
Tablas creadas exitosamente
Insertando datos de ejemplo...

============================================================
Datos de ejemplo insertados exitosamente
============================================================
✓ 3 tipos de voto
✓ 8 electores
✓ 5 partidos políticos
✓ 6 categorías
✓ 16 candidatos
============================================================

DNIs de electores disponibles para pruebas:
  - 12345678: Juan Carlos Pérez García
  - 87654321: María Elena López Torres
  ...

IDs de tipos de voto:
  - ID 1: Válido
  - ID 2: Nulo
  - ID 3: En Blanco
============================================================
```

## Paso 3: Ejecutar el Backend Flask

```bash
python app.py
```

**Salida esperada:**
```
Creando tablas...
Tablas creadas exitosamente
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment.
 * Running on http://0.0.0.0:5000
Press CTRL+C to quit
```

El servidor estará disponible en:
- **API REST**: http://localhost:5000/api/
- **Swagger Docs**: http://localhost:5000/api/docs
- **Frontend**: http://localhost:5000/

## Paso 4: Acceder a la Cédula de Votación

### Opción 1: Navegador
Abrir en el navegador:
```
http://localhost:5000/
```
o
```
http://localhost:5000/cedula
```

### Opción 2: Archivo directo (solo si el backend está corriendo)
Abrir `frontend/index.html` directamente en el navegador.

**IMPORTANTE**: El frontend necesita que el backend esté corriendo en `http://localhost:5000` para funcionar.

## Paso 5: Votar

### 5.1 Seleccionar Candidatos

1. **En cada columna**, click en la fila del partido deseado
2. **Opcionalmente**, marcar hasta 2 candidatos preferenciales (excepto Presidente)
3. **Revisar el panel de estado** en la parte inferior

### 5.2 Revisar Estado

El panel muestra el estado de cada categoría:
- 🟢 **Verde (Válido)**: Voto correcto
- 🔴 **Rojo (Nulo)**: Error a corregir
- ⚫ **Gris (En Blanco)**: Sin selección

### 5.3 Confirmar Voto

1. Click en **"Confirmar Voto"**
2. Revisar el resumen en el modal
3. Ingresar DNI (usar uno de los disponibles)
4. Click en **"Confirmar y Enviar"**

### 5.4 DNIs Disponibles para Pruebas

Después de ejecutar `init_db.py`, estos DNIs están disponibles:
- 12345678
- 87654321
- 11111111
- 22222222
- 33333333
- 44444444
- 55555555
- 66666666

## Verificar que Todo Funciona

### 1. Backend API
```bash
curl http://localhost:5000/api/categorias/
```

**Respuesta esperada:**
```json
[
  {
    "id_categoria": 1,
    "nombre_categoria": "Presidente",
    "ambito": "Nacional"
  },
  ...
]
```

### 2. Swagger Documentation
Abrir en navegador:
```
http://localhost:5000/api/docs
```

Deberías ver la interfaz de Swagger con todos los endpoints disponibles.

### 3. Frontend
Abrir en navegador:
```
http://localhost:5000/
```

Deberías ver la cédula electoral con 5 columnas llenas de candidatos.

## Estructura de URLs del Sistema

| URL | Descripción |
|-----|-------------|
| http://localhost:5000/ | Cédula de votación (Frontend) |
| http://localhost:5000/cedula | Cédula de votación (alternativa) |
| http://localhost:5000/api/ | API REST base |
| http://localhost:5000/api/docs | Documentación Swagger |
| http://localhost:5000/api/categorias/ | Endpoint de categorías |
| http://localhost:5000/api/candidatos/ | Endpoint de candidatos |
| http://localhost:5000/api/partidos/ | Endpoint de partidos |
| http://localhost:5000/api/votos/ | Endpoint para registrar votos |

## Solución de Problemas

### Error: "No se puede conectar con el servidor"

**Problema**: El frontend no puede conectarse al backend.

**Solución**:
1. Verifica que el backend esté corriendo: `python app.py`
2. Verifica que esté en el puerto correcto: `http://localhost:5000`
3. Abre la consola del navegador (F12) para ver errores

### Error: "CORS policy"

**Problema**: Bloqueado por política CORS.

**Solución**: El backend ya tiene CORS habilitado. Si persiste:
1. Verifica que el backend tenga `CORS(app)` en [app/__init__.py](app/__init__.py:20)
2. Reinicia el servidor Flask

### Error: "El elector con DNI X no existe"

**Problema**: El DNI ingresado no está en la base de datos.

**Solución**:
1. Usa uno de los DNIs disponibles (ver arriba)
2. O crea un nuevo elector usando el endpoint `/api/electores/`

### Error: "No module named 'flask'"

**Problema**: Dependencias no instaladas.

**Solución**:
```bash
pip install -r requirements.txt
```

### Error: "could not connect to server: Connection refused"

**Problema**: PostgreSQL no está ejecutándose.

**Solución**:
- **Windows**: Iniciar servicio PostgreSQL desde Servicios
- **Linux**: `sudo service postgresql start`
- **macOS**: `brew services start postgresql`

### Frontend muestra skeleton loader infinitamente

**Problema**: No puede cargar datos del backend.

**Solución**:
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Busca errores en las peticiones fetch
4. Verifica que el backend responda: `curl http://localhost:5000/api/categorias/`

## Flujo Completo de Votación

```
1. Usuario abre http://localhost:5000/
   ↓
2. Frontend carga candidatos desde API
   ↓
3. Usuario selecciona partidos y candidatos
   ↓
4. Validación en tiempo real
   ↓
5. Usuario confirma voto
   ↓
6. Frontend envía POST a /api/votos/
   ↓
7. Backend valida y guarda en PostgreSQL
   ↓
8. Backend retorna ID del voto
   ↓
9. Frontend muestra confirmación
```

## Detener el Sistema

### Detener Backend
Presionar `CTRL+C` en la terminal donde está corriendo `python app.py`

### Cerrar Frontend
Simplemente cerrar la pestaña del navegador.

## Reiniciar la Base de Datos

Si necesitas empezar de cero:

```bash
# Conectar a PostgreSQL
psql -U postgres

# Eliminar base de datos
DROP DATABASE voting_db;

# Crear nueva base de datos
CREATE DATABASE voting_db;

# Salir
\q

# Reinicializar datos
python init_db.py
```

## Producción

**ADVERTENCIA**: Este es un servidor de desarrollo. Para producción:

1. Usar un servidor WSGI como Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
```

2. Configurar HTTPS con certificados SSL

3. Usar un servidor web como Nginx como proxy reverso

4. Configurar variables de entorno seguras

5. Habilitar autenticación real de electores

6. Implementar rate limiting

7. Configurar logs y monitoreo

## Documentación Adicional

- [README Principal](README.md) - Información general del backend
- [Frontend README](frontend/README.md) - Detalles del frontend
- [EJEMPLOS_API.md](EJEMPLOS_API.md) - Ejemplos de uso de la API
- [CAMBIOS_APLICADOS.md](CAMBIOS_APLICADOS.md) - Cambios y correcciones aplicadas
- [SOLID_PRINCIPLES.md](SOLID_PRINCIPLES.md) - Explicación de principios SOLID

## Contacto y Soporte

Para reportar problemas o sugerir mejoras, consulta la documentación o revisa los logs del servidor.

---

**¡Listo para votar! 🗳️**
