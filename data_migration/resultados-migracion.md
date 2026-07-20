# Resultados de migración

Para la migración se realizo un analisis profundo de los datos, la base de este analisis se obtuvo de una conversacion con IA, en el cual se identifico que problemas habian en los datos y cuales alternativas se podian realizar. A partir de esto tomo este analisis base y se construyo un documento que definia la estructura de los datos y como se podian limpiar. Luego se registro los datos de paises, cuidades, sedes, y tipos de documentos de forma manual para evitar problemas derivados de obtener la informacion directa del archivo, luego se mapeo los IDs de sedes y tipos de documentos de modo que se pudieran validar de acuerdo a como se encontraban los datos en el Excel, a partir de esto se llevo a cabo la generación de un script de migracion a traves de un notebook de Google Colab y con este se registro gran parte de los datos, a excepción de algunos pocos que se identificaron dentro del script, para los cuales habian ciertas incidencias y para los cuales se devia realizar una validación manual mas detallada.

* Documento de analisis de los datos: [analisis-datos-migracion](analisis-reglas-validacion.md)

* Script de migración: [script-migracion-empleados](https://drive.google.com/file/d/1JLQxyH_Bf-lj7ZInmFF_FkrWIsICkRQS/view?usp=sharing)

* En la ejecución del script se obtuvieron los siguientes resultados:
```txt
Iniciando procesamiento...
Procesados 50/149
Procesados 100/149
Procesamiento finalizado. Total procesados: 149

Resumen de reporte:
accion_tomada
Revisión manual    13
Advertencia         5
Rechazado           2
```

Y las siguientes incidencias:
```txt

Registros con incidencias:

	codigo_empleado 	motivo 	accion_tomada 	detalles
0 	1102 	Documento inválido o no mapeable 	Revisión manual 	tipo: nan, número: 1216309618
2 	1109 	Sede no mapeable o inexistente 	Revisión manual 	Valor: BAQ-01
4 	1146 	Documento inválido o no mapeable 	Revisión manual 	tipo: CC, número: 1.02E+09
6 	1111 	Sede no mapeable o inexistente 	Revisión manual 	Valor: BOGOTA
7 	1097 	Campos requeridos de persona incompletos 	Rechazado 	Falta primer_nombre o primer_apellido: 'Yoland...
9 	1096 	Documento inválido o no mapeable 	Revisión manual 	tipo: CC, número: nan
10 	1148 	Campos requeridos de persona incompletos 	Rechazado 	Falta primer_nombre o primer_apellido: 'Pedro'...
11 	1143 	Documento duplicado en el lote 	Revisión manual 	tipo: CC, número: 52447891
12 	1110 	Sede no mapeable o inexistente 	Revisión manual 	Valor: Bogotá D.C.
13 	1113 	Fecha de ingreso futura 	Revisión manual 	Fecha: 2027-03-15
14 	1142 	tarjeta_rfid duplicada 	Revisión manual 	tarjeta_rfid: 44556677.0
16 	1114 	Fecha de retiro anterior a fecha de ingreso 	Revisión manual 	Ingreso: 2023-06-01, Retiro: 2022-01-10
17 	1104 	Documento duplicado en el lote 	Revisión manual 	tipo: CC, número: 79458122
18 	1136 	id_biostar duplicado 	Revisión manual 	id_biostar: 91500.0
19 	1098 	Sede no mapeable o inexistente 	Revisión manual 	Valor: nan


Advertencias (no bloqueantes):

	codigo_empleado 	motivo 	accion_tomada 	detalles
1 	1137 	Credencial incompleta (falta id_biostar o tarj... 	Advertencia 	id_biostar: None, tarjeta_rfid: 14671695.0
3 	1129 	Email inválido 	Advertencia 	Valor: carlos.gomez.bancoandino.com
5 	1116 	Estado inactivo sin fecha de retiro 	Advertencia 	Se asigna fecha de retiro NULL
8 	1138 	Credencial incompleta (falta id_biostar o tarj... 	Advertencia 	id_biostar: None, tarjeta_rfid: 30756385.0
15 	1115 	Estado activo con fecha de retiro 	Advertencia 	Se ignora fecha de retiro: 2024-08-30


Reporte guardado como 'reporte_ingesta.csv'
```

## Revisión manual

Luego de esto se llevo a cabo una revisión manual para observar las incidencias detectadas, para lo cual se relizaron los siguientes cambios:

### Registros con incidencias:

* **1102** - El empleado estaba registrado, pero su documento no, debido a que no tiene tipo de documento, por lo que no se puede agregar esta información
* **1109** - El empleado estaba registrado, pero su sede no, debido a que no existe una sede con este código, por lo que no se puede relacionar esta información
* **1146** - El empleado estaba registrado, y se registró su documento con número '1020000000' y tipo CC; el valor estaba en notación científica, por lo que solo se pasó a número entero.
* **1111** - El empleado estaba registrado, pero su sede no, debido a que, aunque es Bogotá, no se sabe cuál sede de Bogotá es la relacionada, por lo que no se puede relacionar esta información
* **1097** - El empleado se registró con el primer apellido según el que había en el correo; se registró sus credenciales de Biostar, la sede y el documento
* **1096** - El empleado estaba registrado, pero su documento no, debido a que no tiene tipo de documento, por lo que no se puede agregar esta información
* **1148** - Solo se tiene el primer nombre; el resto de la información no se tiene, por lo que no se registra
* **1143** - El empleado estaba registrado; al parecer es uno de los casos de empleados que cambiaron de sede y les crearon nuevas credenciales. Los datos de correo, documento, y parte del nombre son iguales. El empleado está inactivo, ya que tiene fecha de retiro; no se elimina el registro, ya que no es totalmente seguro que sea el caso, ya que el segundo apellido no es el mismo (puede ser por un error al ingresar los datos), por lo que se conserva hasta que se pueda validar.
* **1110** - El empleado estaba registrado, pero su sede no, debido a que, aunque es Bogotá, no se sabe cuál sede de Bogotá es la relacionada, por lo que no se puede relacionar esta información
* **1113** - Se registró al empleado, su sede, documento y credenciales Biostar, pero sin registrar fecha de ingreso y activo
* **1142** - El empleado estaba registrado, pero su tarjeta_rfid ya estaba registrada en otro empleado (puede ser por errores en ingresos de datos); no se puede validar esto, por lo que no se puede relacionar esta información
* **1114** - Se registró al empleado, su sede, documento y credenciales biostar, pero sin registrar fecha de ingreso y no activo
* **1104** - El empleado estaba registrado; su documento ya está registrado en otra persona (puede ser por errores en ingresos de datos). No se encontró información que pueda decir que es la misma persona (el nombre es diferente, al igual que el correo, por ejemplo); no se puede validar esto, por lo que no se puede relacionar esta información
* **1136** - El empleado estaba registrado, pero su id_biostar ya estaba registrada en otro empleado (puede ser por errores en ingresos de datos); no se puede validar esto, por lo que no se puede relacionar esta información
* **1098** - El empleado estaba registrado, pero su sede no se proporcionó, por lo que no se puede registrar esta información

### Advertencias (no bloqueantes):

* **1137** - No se tiene el id_biostar para crear las credenciales
* **1129** - No se actualiza el usuario; el correo no es válido y no coincide con el nombre del empleado
* **1116** - Se actualiza a activo, ya que no hay fecha de retiro
* **1138** - No se tiene el id_biostar para crear las credenciales
* **1115** - Se agregó la fecha de retiro, pero se cambió a no activo

