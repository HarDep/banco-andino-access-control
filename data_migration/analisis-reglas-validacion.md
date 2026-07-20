## 1. Estructura del archivo

**Hoja "Sedes"** (6 filas, 7 columnas): `codigo_sede, nombre_sede, ciudad, pais, direccion, aforo_maximo, activa`. Está limpia — funciona bien como catálogo maestro de referencia. Sedes válidas: `BOG-TOR, BOG-CD, MED-01, CAL-01` (Colombia) y `PTY-01, CHI-01` (Panamá). El campo `aforo_maximo` ya trae el límite por sede, el campo `activa` tiene en todas las filas valores `SI`, listo para usarse.

**Hoja "Empleados"** (149 filas, 22 columnas). Mapea principalmente a las entidades `PERSONA`, `PERSONA_DOCUMENTO`, `EMPLEADO_SEDE_ACCESO` y `CREDENCIAL_BIOSTAR` del modelo ER.

## Campos de `Empleados`, significado y uso en el proyecto

| Campo | Significado |
|---|---|
| `codigo_empleado` | Identificador interno |
| `primer_nombre`, `segundo_nombre`, `primer_apellido`, `segundo_apellido` | Nombre completo |
| `tipo_doc` | Tipo de documento |
| `numero_documento` | Número del documento |
| `pais` | País del empleado |
| `sede` | Código de sede asignada |
| `area` | Área/departamento |
| `cargo` | Cargo  |
| `centro_costo` | Código contable |
| `tipo_contrato` | Indefinido, Fijo, Aprendizaje |
| `fecha_ingreso` | Fecha de ingreso a la compañía |
| `fecha_retiro` | Fecha de retiro, si aplica |
| `estado` | estado de empleado |
| `email` | Correo |
| `telefono` | Teléfono de contacto |
| `id_biostar` | ID del usuario en BioStar |
| `tarjeta_rfid` | Número de tarjeta/credencial |
| `nivel_acceso` | Nivel de acceso |
| `jornada` | Jornada |

## 2. Problemas de calidad detectados

**A. Variantes semánticas del mismo valor** (necesitan normalización por catálogo, no solo `.strip()/.upper()`)
| Campo | Variantes encontradas |
|---|---|
| `pais` | Colombia (116), Panamá (29), **PA** (1), **PANAMA** (1), **Panama** (1), nulo (1) |
| `estado` | Activo (131), Inactivo (14), **ACTIVO** (1), **A** (1), **Retirado** (1), nulo (1) |
| `tipo_contrato` | Indefinido (80), Aprendizaje (35), Fijo (30), **INDEFINIDO** (1), **indef** (1) |
| `tipo_doc` | CC, CE, CIP válidos; **PAS**, **N**, **PA** — parecen typos o tipos no catalogados |

**B. Inconsistencia código de sede vs. catálogo Sedes**
- `sede = BAQ-01` (empleado 1109): código que **no existe** en la hoja Sedes (¿Barranquilla, sede faltante?)
- `sede = BOGOTA` y `sede = "Bogotá D.C."` (empleados 1111, 1110): usaron el nombre de ciudad en vez del código
- Empleado 1112: `pais = Panamá` pero `sede = MED-01` (Medellín, Colombia) — inconsistencia cruzada real

**C. Registros duplicados**
- **Documento idéntico** (mismo tipo_doc + numero_documento + pais) en **personas distintas**: `52447891` (Sandra Villamil Peña *vs* Sandra Villamil Álvarez — posible mismo apellido mal digitado) y `79458122` (Miguel Ríos Espinosa *vs* Mónica Ríos Quintero — nombres distintos, muy probablemente error de digitación del documento)
- **`id_biostar` duplicado**: `91500` compartido por dos empleados distintos (1135, 1136)
- **`tarjeta_rfid` duplicada**: `44556677` compartida por dos empleados (1141, 1142)

**D. Registros vacíos / incompletos**
- Empleado **1148 (Pedro)**: solo tiene `codigo_empleado` y `primer_nombre`; todo lo demás nulo — no cumple ningún campo requerido del modelo (`primer_apellido`, `email` son *required* en `PERSONA`)

**E. Problemas de formato**
- `numero_documento`: notación científica **`1.02E+09`** (dato irrecuperable, se perdió precisión — no se puede limpiar algorítmicamente), formato con puntos de miles **`1.020.304.050`**, espacios extra **`"  52889147  "`**
- `email`: uno sin `@` (**`carlos.gomez.bancoandino.com`**) y además el nombre en el correo (carlos.gomez) no coincide con el titular (Alfonso Vargas) — sospecha de fila con dato pegado incorrectamente
- `telefono`: **50 registros comparten el mismo número `3105551234`** — valor placeholder/dummy, no un teléfono real
- `fecha_ingreso`: un registro con fecha futura **2027-03-15** (¿error de digitación de año?); otro con `fecha_retiro` **anterior** a `fecha_ingreso`
- `estado` vs `fecha_retiro` inconsistentes en 2 casos (activo con fecha de retiro, o inactivo sin fecha de retiro)
- Acentos/mayúsculas inconsistentes en nombres vs. email (cosmético, no bloquea el insert)

## 3. Estrategia de limpieza propuesta (mapeada al modelo ER)

| Problema | Estrategia |
|---|---|
| Variantes semánticas (país, estado, tipo_contrato, tipo_doc) | Diccionario de mapeo explícito (`{"PA":"Panamá","PANAMA":"Panamá",...}`) en vez de solo normalizar texto |
| Sede inexistente / mal escrita | Tabla de excepciones para revisión manual — **no** adivinar automáticamente a cuál sede pertenece |
| Duplicados en documento/id_biostar/tarjeta_rfid | Nunca fusionar automáticamente; generar reporte de "posibles duplicados" con score de similitud de nombre para que un humano decida (¿misma persona con error, o coincidencia?) |
| Registros vacíos sin campos requeridos | Excluir del insert e incluir en un log de "rechazados" con motivo |
| `1.02E+09` (documento irrecuperable) | No se puede limpiar por código — no añadir documento e incluir en un log de "rechazados" con motivo  |
| Teléfono placeholder repetido | Tratar como "dato faltante" (NULL), no como 50 teléfonos reales iguales |
| Fechas inconsistentes | Reglas de validación (`fecha_retiro >= fecha_ingreso`, `fecha_ingreso <= hoy`) → registros que fallen van a revisión, no se corrigen a ciegas |
| `tipo_doc` (catálogo TIPO_DOCUMENTO por país) | Crear catálogo `TIPO_DOCUMENTO` primero (CC/CE → Colombia, CIP/PAS → Panamá) antes de insertar `PERSONA_DOCUMENTO` |
