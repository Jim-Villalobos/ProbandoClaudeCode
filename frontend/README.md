# Cédula de Votación Electoral - Frontend

Réplica visual de una cédula de votación electoral peruana (estilo ONPE) que se comunica con el backend Flask para obtener y registrar votos.

## Características

### Diseño Visual
- ✅ Réplica fiel de la cédula electoral peruana ONPE 2026
- ✅ 5 columnas: Presidentes, Senadores Nacional, Senadores Regional, Diputados, Parlamento Andino
- ✅ Colores distintivos por categoría (verde, azul, mostaza, marrón)
- ✅ Logo ONPE y marca de agua UNIVERSO
- ✅ Diseño responsive para diferentes tamaños de pantalla

### Funcionalidades

#### Integración con Backend
- ✅ Carga dinámica de candidatos desde la API Flask
- ✅ Skeleton loaders mientras cargan los datos
- ✅ Manejo de errores con reintentos automáticos
- ✅ Validación de conexión al servidor

#### Validación de Votos
**Presidente/Vicepresidente:**
- Solo se puede seleccionar un partido
- Voto en blanco si no se selecciona nada
- Voto nulo si se marca más de un partido

**Senadores, Diputados, Parlamento Andino:**
- Selección de partido requerida
- Votos preferenciales opcionales (máximo 2)
- Candidatos preferenciales solo del partido seleccionado
- Voto nulo si se seleccionan candidatos sin partido
- Voto nulo si se excede el máximo de preferenciales

#### Interactividad
- ✅ Validación en tiempo real de cada selección
- ✅ Advertencias visuales inmediatas para votos nulos
- ✅ Panel de estado mostrando: Válido (verde), Nulo (rojo), En Blanco (gris)
- ✅ Feedback visual al hacer hover sobre filas
- ✅ Click en toda la fila para seleccionar partido
- ✅ Desmarcar automático al cambiar de partido
- ✅ Botón para limpiar todas las selecciones
- ✅ Modal de confirmación con resumen del voto

## Estructura de Archivos

```
frontend/
├── index.html          # Estructura principal de la cédula
├── css/
│   └── styles.css      # Estilos completos (Grid, responsive, animaciones)
├── js/
│   ├── api.js          # Módulo de comunicación con backend Flask
│   ├── validation.js   # Lógica de validación por categoría
│   └── main.js         # Controlador principal de la aplicación
└── images/             # Logos de partidos (opcional)
```

## Cómo Usar

### 1. Asegúrate de que el backend esté corriendo

```bash
cd voting_api
python app.py
```

El servidor debe estar ejecutándose en `http://localhost:5000`

### 2. Inicializa la base de datos con datos de ejemplo

```bash
python init_db.py
```

Esto creará:
- 3 tipos de voto
- 8 electores
- 5 partidos políticos
- 6 categorías
- 16 candidatos

### 3. Abre la cédula en el navegador

Opción 1 - Directamente:
```
http://localhost:5000/
```

Opción 2 - Ruta específica:
```
http://localhost:5000/cedula
```

### 4. Votar

1. **Selecciona un partido** en cada categoría haciendo click en su fila
2. **Opcionalmente**, selecciona hasta 2 candidatos preferenciales (excepto Presidente)
3. **Revisa el panel de estado** para asegurarte que no haya votos nulos
4. **Click en "Confirmar Voto"** para ver el resumen
5. **Ingresa tu DNI** cuando se solicite (debe existir en la BD)
6. **Confirma el envío** y tu voto será registrado

## Validación de Votos por Categoría

### Presidente
```
✓ VÁLIDO: Un solo partido marcado
✗ NULO: Más de un partido marcado
○ EN BLANCO: Ningún partido marcado
```

### Senadores / Diputados / Parlamento
```
✓ VÁLIDO: Partido marcado (con o sin preferenciales del mismo partido)
✗ NULO:
   - Candidatos sin partido
   - Más de 2 preferenciales
   - Candidatos de diferentes partidos
○ EN BLANCO: Ninguna selección
```

## Estados Visuales

### Panel de Estado
- 🟢 **Verde (Válido)**: El voto fue marcado correctamente
- 🔴 **Rojo (Nulo)**: Hay un error que debe corregirse
- ⚫ **Gris (En Blanco)**: No se realizó ninguna selección

### Notificaciones Toast
- **Success** (verde): Operación exitosa
- **Warning** (naranja): Advertencia de voto nulo
- **Error** (rojo): Error de conexión o validación

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**:
  - CSS Grid para layout de 5 columnas
  - Flexbox para componentes
  - Animaciones y transiciones
  - Diseño responsive
- **JavaScript Vanilla**: Sin frameworks externos
  - Módulos ES6
  - Fetch API para comunicación con backend
  - Validación en tiempo real
  - Manejo de estado

## API Endpoints Utilizados

### GET
- `/api/categorias/` - Obtiene todas las categorías
- `/api/candidatos/` - Obtiene todos los candidatos
- `/api/partidos/` - Obtiene todos los partidos
- `/api/tipos-voto/` - Obtiene tipos de voto

### POST
- `/api/votos/` - Registra un voto completo con sus categorías

## Ejemplo de Petición de Voto

```javascript
POST http://localhost:5000/api/votos/

{
  "dni": "12345678",
  "id_tipo_voto": 1,
  "votos_categoria": [
    {
      "id_categoria": 1,
      "id_partido": 1,
      "numero_preferencial_1": null,
      "numero_preferencial_2": null
    },
    {
      "id_categoria": 3,
      "id_partido": 2,
      "numero_preferencial_1": 101,
      "numero_preferencial_2": 102
    }
  ]
}
```

## Manejo de Errores

### Error de Conexión
```
No se puede conectar con el servidor.
Verifica que esté ejecutándose en http://localhost:5000
```
**Solución**: Asegúrate de que `python app.py` esté corriendo.

### DNI No Existe
```
El elector con DNI 99999999 no existe
```
**Solución**: Usa uno de los DNIs creados por `init_db.py` o crea un nuevo elector.

### Voto Nulo
```
Debes seleccionar primero el partido antes de marcar candidatos preferenciales.
```
**Solución**: Marca el partido antes de seleccionar candidatos.

## Responsive Design

### Desktop (>1400px)
- Grid de 5 columnas
- Panel de validación horizontal

### Tablet (900px - 1400px)
- Grid de 3 columnas
- Scroll vertical

### Mobile (<600px)
- Grid de 1 columna
- Botones de acción apilados verticalmente
- Panel de validación vertical

## Personalización

### Cambiar Colores de Categorías
Edita en `css/styles.css`:

```css
.presidentes-header { background-color: #4a7c59; }
.senadores-header { background-color: #5b8ba8; }
.diputados-header { background-color: #d4a845; }
.parlamento-header { background-color: #8b6b47; }
```

### Cambiar URL del Backend
Edita en `js/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### Modificar Número Máximo de Preferenciales
Edita en `js/validation.js`:

```javascript
'senador-nacional': {
    max_preferenciales: 2  // Cambiar aquí
}
```

## Testing

### Probar con Datos Reales

1. Ejecuta `python init_db.py`
2. Abre la cédula
3. Usa uno de los DNIs disponibles:
   - 12345678, 87654321, 11111111, 22222222
   - 33333333, 44444444, 55555555, 66666666

### Probar Validaciones

**Voto Nulo:**
1. Selecciona candidatos sin seleccionar partido
2. Observa la advertencia roja

**Voto Válido:**
1. Selecciona un partido
2. Opcionalmente marca hasta 2 candidatos
3. Observa el badge verde

**Voto en Blanco:**
1. No selecciones nada
2. Observa el badge gris

## Performance

- ✅ Carga paralela de todas las categorías
- ✅ Reintentos automáticos con backoff exponencial
- ✅ Skeleton loaders para mejor UX
- ✅ Validación en tiempo real sin bloqueo
- ✅ Animaciones optimizadas con CSS
- ✅ Mínimo uso de dependencias (0 frameworks)

## Navegadores Soportados

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

## Próximas Mejoras

- [ ] Autenticación de electores
- [ ] Captura de foto al votar
- [ ] Impresión de comprobante
- [ ] Modo offline con sincronización
- [ ] Accesibilidad (ARIA labels, navegación por teclado)
- [ ] Internacionalización (i18n)
- [ ] PWA (Progressive Web App)

## Créditos

Desarrollado para el sistema de votación electoral de Perú 2026, siguiendo los lineamientos de ONPE (Oficina Nacional de Procesos Electorales).
