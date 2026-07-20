# **Documento de Definición de Requisitos**

**Historias de Usuario**

*Sistema de Control de Acceso a Instalaciones — Banco Andino*
# **Introducción**
Este documento define los requisitos funcionales del sistema de control de acceso a instalaciones del Banco Andino, expresados como historias de usuario, en conjunto con los requisitos no funcionales aplicables al MVP. Las historias de usuario se agrupan en cuatro épicas: gestión de información de empleados, gestión de catálogo de tipo de documento, gestión de eventos de ingreso y salida, y autenticación.
# **Épica 1: Gestión de información de empleados**
*Los empleados son la información principal sobre la cual opera el sistema. Incluye el registro, consulta, actualización y habilitación/inhabilitación de empleados, así como el cargue masivo desde el archivo Excel que administra Talento Humano y la sincronización de credenciales hacia BioStar.*

|**ID**|**HU-01 — Crear empleado**|
| :- | :- |
|**Descripción**|Como Jefe de Talento Humano, quiero registrar un empleado nuevo en el sistema con su información básica y su documento de identificación, para que la información del personal resida en el sistema propio y pueda utilizarse para el control de acceso.|
|**Story Points**|5|
|**Prioridad**|**Alta**|
|**Criterios de Aceptación**|<p>- El sistema debe permitir registrar los datos básicos del empleado y la(s) sede(s) a la que está asociado.</p><p>- Debe permitir asociar uno o más documentos de identificación al empleado, cada uno relacionado por tipo de documento, país y valor. El sistema debe validar que la combinación tipo de documento + país + valor no esté ya registrada para otro empleado activo incluso si el valor de documento es el mismo asociado a un país distinto.</p><p>- Si el empleado tiene un único documento registrado, este debe quedar marcado automáticamente como el documento principal.</p><p>- Si se registra más de un documento, el sistema debe permitir indicar cuál queda marcado como principal (documento con el que se identificará al empleado).</p><p>- El sistema debe permitir asociar al empleado con más de una sede, dado que existe personal que ingresa a varias sedes, pero debe indicarse una de estas como sede principal asociada.</p><p>- Al guardar exitosamente, el sistema debe confirmar el registro y mostrar la información del empleado creado.</p>|

|**ID**|**HU-02 — Obtener empleados (incluyendo filtros)**|
| :- | :- |
|**Descripción**|Como Jefe de Talento Humano o Gerente de Seguridad Física, quiero consultar el listado de empleados registrados aplicando filtros, para ubicar la información que necesito sin revisar manualmente todos los registros.|
|**Story Points**|3|
|**Prioridad**|**Alta**|
|**Criterios de Aceptación**|<p>- El sistema debe listar los empleados registrados mostrando al menos nombre, documento principal, sede(s) asociada(s) y estado (activo/inhabilitado).</p><p>- Debe permitir filtrar el listado al menos por sede, estado y tipo/número de documento.</p><p>- El resultado mostrado debe corresponder únicamente a los registros que cumplen los criterios de filtro seleccionados.</p><p>- Debe permitir consultar el detalle completo de un empleado individual, incluyendo todos los documentos de identificación asociados.</p>|

|**ID**|**HU-03 — Actualizar empleado**|
| :- | :- |
|**Descripción**|Como Jefe de Talento Humano, quiero actualizar la información de un empleado, para mantener la información actualizada ante situaciones como traslados o adquisición de documentos de identificación.|
|**Story Points**|5|
|**Prioridad**|**Media**|
|**Criterios de Aceptación**|<p>- El sistema debe permitir modificar los datos básicos del empleado, incluyendo la(s) sede(s) asociada(s), y cual es la sede principal.</p><p>- Debe permitir añadir un nuevo documento de identificación (tipo, país, valor) sin eliminar los documentos ya existentes del empleado, contemplando el caso de colaboradores trasladados que conservan su documento de origen y tramitan uno nuevo en el país destino.</p><p>- Debe permitir eliminar un documento de identificación existente del empleado.</p><p>- Debe permitir marcar cuál documento queda como principal; si tras la actualización el empleado queda con un único documento, este debe marcarse automáticamente como principal.</p><p>- El sistema debe validar que la combinación tipo de documento + país + valor no se duplique con otro empleado activo al añadir un documento.</p><p>- Al guardar los cambios, el sistema debe confirmar la actualización realizada.</p>|

|**ID**|**HU-04 — Habilitar/Inhabilitar empleado**|
| :- | :- |
|**Descripción**|Como Jefe de Talento Humano, quiero habilitar o inhabilitar el registro de un empleado, para mantener la información de empleados actualizada, sin perder el historial de eventos.|
|**Story Points**|2|
|**Prioridad**|**Media**|
|**Criterios de Aceptación**|<p>- El sistema debe permitir cambiar el estado del empleado a habilitado o inhabilitado, sin eliminar físicamente el registro ni el historial de eventos de ingreso/salida asociados.</p><p>- El listado de empleados (HU-02) debe permitir filtrar por estado para identificar los empleados inhabilitados.</p><p>- El sistema debe solicitar confirmación antes de inhabilitar el registro.</p>|

|**ID**|**HU-05 — Cargue masivo de empleados**|
| :- | :- |
|**Descripción**|Como Jefe de Talento Humano, quiero cargar un archivo Excel con la información de los empleados y conocer qué registros se cargaron correctamente, cuáles no y por qué motivo, para poder corregir con rapidez la información sin que se rechace el archivo completo.|
|**Story Points**|13|
|**Prioridad**|**Media**|
|**Criterios de Aceptación**|<p>- El sistema debe permitir cargar un archivo Excel con información de empleados.</p><p>- El sistema debe aplicar reglas de validación con severidad diferenciada: la ausencia de un dato crítico (por ejemplo, el número de documento) debe impedir el registro únicamente de esa fila; la ausencia de un dato no crítico (por ejemplo, el teléfono) no debe impedir el registro.</p><p>- El sistema no debe rechazar el archivo completo si algunos registros presentan errores; debe procesar los registros válidos y excluir únicamente los que tengan errores críticos.</p><p>- Al finalizar la carga, el sistema debe presentar un resumen indicando qué registros se cargaron, cuáles no, y el motivo específico de cada registro no cargado.</p><p>- El sistema debe tolerar y procesar campos vacíos en columnas no críticas.</p><p>- El sistema debe tolerar fechas registradas en formatos distintos y normalizarlas a un formato único al procesarlas.</p><p>- El sistema debe tolerar nombres de sede no estandarizados y asociarlos a la sede correspondiente, pero sin marcar como sede principal del empleado si se asocia una sede adicional.</p><p>- El sistema debe tolerar números de documento registrados con puntos u otros caracteres no numéricos y limpiarlos antes de validarlos.</p><p>- El sistema debe identificar posibles registros duplicados, tanto dentro del archivo como frente a los empleados ya existentes en el sistema.</p><p>- El sistema debe permitir al usuario decidir si los registros que coincidan con un empleado ya existente deben actualizarse o dejarse sin cambios.</p><p>- Si el usuario decide actualizar y el archivo trae un documento de identificación nuevo para un empleado ya existente, el sistema debe añadir dicho documento y marcarlo como principal.</p><p>- El proceso de carga debe poder repetirse para futuras actualizaciones del archivo, sin quedar limitado a una única ejecución.</p>|

|**ID**|**HU-06 — Integración con BioStar para sincronización de empleados**|
| :- | :- |
|**Descripción**|Como Coordinador de Infraestructura TI, quiero que la información de empleados se sincronice automáticamente hacia BioStar, para que los lectores biométricos y molinetes reflejen la información gestionada desde el sistema propio.|
|**Story Points**|8|
|**Prioridad**|**Alta**|
|**Criterios de Aceptación**|<p>- El sistema debe integrarse con la API REST/JSON pública de BioStar (bs2api.biostar2.com) para sincronizar información de empleados.</p><p>- La creación y actualización de información de un empleado en el sistema propio debe generar la correspondiente sincronización hacia BioStar.</p>|

|**ID**|**HU-07 — Exportación de reportes de información de empleados**|
| :- | :- |
|**Descripción**|Como Jefe de Talento Humano o Gerente de Seguridad Física, quiero exportar a Excel la información de empleados que se muestra en el sistema, para poder descargarla y utilizarla fuera del sistema.|
|**Story Points**|3|
|**Prioridad**|**Media**|
|**Criterios de Aceptación**|<p>- El sistema debe permitir exportar en formato Excel la información de empleados actualmente desplegada o filtrada en pantalla.</p><p>- El archivo exportado debe reflejar los filtros aplicados en la consulta (HU-02).</p><p>- El archivo exportado debe incluir, como mínimo, nombre, documento principal, sede(s) y estado de cada empleado.</p>|
# **Épica 2: Gestión de catálogo de tipo de documento**
*El tipo de documento de identificación depende del país del empleado, por lo que se gestiona como un catálogo configurable en lugar de una lista fija en el sistema.*

|**ID**|**HU-08 — Crear tipo de documento**|
| :- | :- |
|**Descripción**|Como administrador del sistema, quiero registrar nuevos tipos de documento asociados a un país, para poder identificar empleados de distintos países sin que la lista fija de un país limite el registro de los demás.|
|**Story Points**|3|
|**Prioridad**|**Alta**|
|**Criterios de Aceptación**|<p>- El sistema debe permitir crear un tipo de documento indicando su nombre/identificador (por ejemplo, cédula de ciudadanía, cédula de extranjería, pasaporte, etc) y el país al que aplica.</p><p>- El sistema debe permitir registrar tipos de documento distintos para cada país, de forma que un tipo definido para un país no quede disponible para empleados de otro país.</p><p>- El sistema debe validar que no se dupliquen tipos de documento iguales para el mismo país.</p><p>- Al guardar exitosamente, el sistema debe confirmar la creación del tipo de documento.</p>|

|**ID**|**HU-09 — Obtener tipos de documento**|
| :- | :- |
|**Descripción**|Como usuario del sistema que gestiona empleados, quiero consultar el catálogo de tipos de documentos disponibles, filtrando por país, para seleccionar el tipo correcto.|
|**Story Points**|2|
|**Prioridad**|**Alta**|
|**Criterios de Aceptación**|<p>- El sistema debe listar los tipos de documento registrados, mostrando el país asociado y su estado (activo/inhabilitado).</p><p>- Debe permitir filtrar el catálogo por país.</p><p>- Al registrar o actualizar un empleado, únicamente deben ofrecerse como opción los tipos de documento activos correspondientes al país del documento que se está registrando.</p>|

|**ID**|**HU-10 — Actualizar tipo de documento**|
| :- | :- |
|**Descripción**|Como administrador del sistema, quiero actualizar la información de un tipo de documento existente, para corregir o ajustar sus datos sin necesidad de eliminarlo y volver a crearlo.|
|**Story Points**|2|
|**Prioridad**|**Media**|
|**Criterios de Aceptación**|<p>- El sistema debe permitir modificar el nombre/identificador y/o el país asociado a un tipo de documento existente.</p><p>- El sistema debe validar que la actualización no genere duplicados de tipo de documento para el mismo país.</p><p>- Al guardar los cambios, el sistema debe confirmar la actualización realizada.</p>|

|**ID**|**HU-11 — Habilitar/Inhabilitar tipo de documento**|
| :- | :- |
|**Descripción**|Como administrador del sistema, quiero habilitar o inhabilitar un tipo de documento que ya no debe utilizarse o que se necesite nuevamente ser usado, para que esté o no disponible al registrar o actualizar empleados, sin afectar los registros históricos que ya lo utilizan.|
|**Story Points**|2|
|**Prioridad**|**Media**|
|**Criterios de Aceptación**|<p>- El sistema debe permitir cambiar el estado de un tipo de documento a inhabilitado o habilitado.</p><p>- Un tipo de documento inhabilitado no debe aparecer como opción seleccionable al crear o actualizar empleados.</p><p>- Los documentos de empleados que ya utilizan ese tipo deben conservar la referencia sin verse afectados.</p><p>- El sistema debe solicitar confirmación antes de inhabilitar el tipo de documento.</p>|
# **Épica 3: Gestión de eventos de ingreso y salida**
*Cubre el registro de los eventos de acceso por sede, el manejo de sesiones sin salida registrada, y las necesidades de reportería y visualización de ocupación que hoy se consolidan manualmente.*

|**ID**|**HU-12 — Captura y registro automático de eventos de ingreso y salida**|
| :- | :- |
|**Descripción**|Como Coordinador de Infraestructura TI, quiero que los eventos de ingreso y salida de los empleados por sede se registren automáticamente en el sistema, incluyendo el manejo de situaciones en las que no registran salida, para contar con información confiable del historial de accesos y de la ocupación sin depender de consolidaciones manuales.|
|**Story Points**|8|
|**Prioridad**|**Alta**|
|**Criterios de Aceptación**|<p>- El sistema debe registrar cada evento de ingreso y salida indicando, como mínimo, empleado, sede, tipo de evento (ingreso/salida) y fecha/hora.</p><p>- El sistema debe asociar los eventos a la sede correspondiente, contemplando las seis sedes identificadas (torre Bogotá, centro de datos Bogotá, Medellín, Cali, Ciudad de Panamá y Chitré).</p><p>- El sistema debe manejar el caso de situaciones de acceso sin salida registrada, aplicando un reinicio automático a medianoche como salvaguarda de cierre de dichas sesiones para que no permanezcan abiertas indefinidamente.</p><p>- El sistema debe calcular la ocupación por sede a partir de los eventos de ingreso y salida registrados y de las sesiones que permanecen abiertas.</p><p>- El nivel de granularidad del cálculo de ocupación corresponde a la sede.</p>|

|**ID**|**HU-13 — Exportación de reportes de ingresos y salidas**|
| :- | :- |
|**Descripción**|Como Gerente de Seguridad Física, quiero exportar a Excel los reportes de ingresos y salidas aplicando filtros por sede, mes o rango de tiempo, para atender solicitudes en las que se necesita la información de registros de ingresos y salidas.|
|**Story Points**|5|
|**Prioridad**|**Alta**|
|**Criterios de Aceptación**|<p>- El sistema debe permitir generar un reporte de eventos de ingreso y salida filtrado por sede.</p><p>- El sistema debe permitir filtrar el reporte por mes o por un rango de fechas específico (por ejemplo, un día puntual como un sábado, o un mes completo).</p><p>- El sistema debe permitir exportar el resultado del reporte en formato Excel.</p><p>- El reporte exportado debe incluir, como mínimo, empleado, sede, tipo de evento y fecha/hora de cada evento consultado.</p>|

|**ID**|**HU-14 — Visualización en tiempo real de ingresos y salidas**|
| :- | :- |
|**Descripción**|Como Gerente de Seguridad Física, quiero visualizar en un tablero la cantidad de personas presentes en cada sede en tiempo real, con filtros por sede, mes o rango de tiempo, para contar con la información de ocupación que la gerencia solicita de forma permanente.|
|**Story Points**|8|
|**Prioridad**|**Media**|
|**Criterios de Aceptación**|<p>- El tablero debe mostrar, para cada sede, la cantidad de personas actualmente dentro de las instalaciones, calculada a partir de los eventos de ingreso y salida registrados.</p><p>- El tablero debe permitir filtrar la información por sede.</p><p>- El tablero debe permitir consultar información histórica por mes o por rango de tiempo, además de la vista en tiempo real.</p><p>- La información del tablero debe actualizarse a medida que se registran nuevos eventos de ingreso y salida.</p>|
# **Épica 4: Autenticación**
*Aunque no fue discutida explícitamente en la reunión, esta épica se define por coherencia con la información que gestiona el sistema y los distintos actores que operan sobre ella, lo cual hace necesario un control de acceso propio al aplicativo.*

|**ID**|**HU-15 — Iniciar sesión (login)**|
| :- | :- |
|**Descripción**|Como usuario del sistema, quiero iniciar sesión con mis credenciales, para acceder de forma segura a las funcionalidades del sistema según mi rol.|
|**Story Points**|3|
|**Prioridad**|**Alta**|
|**Criterios de Aceptación**|<p>- El sistema debe solicitar credenciales (usuario/correo y contraseña) para iniciar sesión.</p><p>- El sistema debe validar las credenciales ingresadas y permitir el acceso únicamente si son correctas.</p><p>- Si las credenciales son incorrectas, el sistema debe mostrar un mensaje de error, sin indicar cuál de los dos datos es el incorrecto.</p><p>- Una vez autenticado, el sistema debe dar acceso a las funcionalidades correspondientes al rol del usuario.</p>|

|**ID**|**HU-16 — Cerrar sesión (logout)**|
| :- | :- |
|**Descripción**|Como usuario del sistema, quiero cerrar mi sesión, para proteger el acceso a la información cuando termine de usar el sistema.|
|**Story Points**|1|
|**Prioridad**|**Alta**|
|**Criterios de Aceptación**|<p>- El sistema debe permitir cerrar la sesión activa desde cualquier pantalla en la que el usuario esté autenticado.</p><p>- Al cerrar sesión, el sistema debe redirigir a la pantalla de inicio de sesión.</p><p>- Tras cerrar sesión, no debe ser posible acceder a las funcionalidades protegidas sin autenticarse nuevamente.</p>|

|**ID**|**HU-17 — Recuperación de contraseña**|
| :- | :- |
|**Descripción**|Como usuario del sistema, quiero recuperar el acceso a mi cuenta cuando olvido mi contraseña, para poder volver a ingresar al sistema sin depender de que un administrador la restablezca manualmente.|
|**Story Points**|3|
|**Prioridad**|**Baja**|
|**Criterios de Aceptación**|<p>- El sistema debe ofrecer una opción de recuperación de contraseña desde la pantalla de inicio de sesión.</p><p>- El sistema debe validar la identidad del usuario mediante el correo electrónico registrado antes de permitir el restablecimiento.</p><p>- El sistema debe permitir definir una nueva contraseña una vez validada la identidad del usuario.</p><p>- El sistema debe confirmar al usuario que la contraseña fue actualizada exitosamente.</p>|
# **Requisitos no funcionales**
A continuación se listan las restricciones y atributos de calidad definidos explícitamente por el Coordinador de Infraestructura TI durante la reunión, junto con la justificación correspondiente.

|**ID**|**Descripción**|**Justificación**|
| :- | :- | :- |
|RNF-01|Portabilidad de infraestructura: el sistema debe poder operar tanto sobre servidores propios como en la nube, empaquetado y desplegado mediante contenedores (Docker).|Actualmente la organización opera con servidores propios, pero existe un plan de migración a la nube en formulación. Se solicitó explícitamente evitar la instalación manual de componentes en el servidor y dejar el sistema preparado para operar en cualquiera de los dos escenarios.|
|RNF-02|Restricción tecnológica de base de datos: el sistema debe utilizar PostgreSQL como motor de base de datos.|Es el estándar tecnológico definido por la organización; se indicó como un punto no negociable.|
|RNF-03|Restricción tecnológica de frontend: el frontend del sistema debe desarrollarse en React.|El equipo interno de Infraestructura TI maneja React y se requiere que dicho equipo pueda darle continuidad al sistema si el proveedor de desarrollo sale del proyecto.|
# <a name="_heading=h.ko0zditf8p4u"></a>**Preguntas y suposiciones**
Los siguientes puntos son cuestiones que no se resolvieron dentro de la reunión, vacíos o contradicciones, o temas no tratados dentro de la misma. En cada uno se indica suposiciones que se tomaron en cuenta y posibles preguntas que se podrían realizar para aclarar los puntos:

- Dentro de la reunión se menciona que hubo colaboradores que se trasladaron a Panamá, y tramitaron carné de residente conservando la cédula colombiana, por lo que tienen dos documentos vigentes. Luego se expone que se revisará posteriormente, por lo que es una cuestión sin resolver.
  - Preguntas que se podrían realizar:
    - ¿Es necesario guardar los documentos de identidad para cada empleado o con solo registrar uno de estos es suficiente?
    - ¿Si se guardan varios documentos, cuál se toma como identificador principal, o con qué criterio se elige el documento principal?
  - Suposiciones:
    - Al no definirse este tema se tomó en consideración la posibilidad de guardar varios documentos para un mismo empleado, permitiendo que quien ingrese o actualice la información de un empleado pueda elegir cual tomar como principal, por otra parte en la carga de empleados con archivo Excel si se debe actualizar la información de empleados existentes, se añade el documento si un empleado ya tiene y es diferente al existente y se toma como principal este al ser el último usado para el registro.
- Al momento de mencionar la carga de información se menciona que debe haber criterios para registrar la información y que se debe mostrar qué información se registró o no y el motivo, de igual modo en otro momento de la reunión se menciona que existen registros duplicados, pero no se mencionó de qué modo manejar esta información de empleados ya registrados que están en el mismo archivo de carga o en el sistema.
  - Preguntas que se podrían realizar:
    - ¿Si hay un empleado ya registrado en el sistema, o si el archivo que se carga tiene internamente varias filas con información de un mismo empleado, se debe actualizar el empleado con esta información o se descarta esta información?
  - Suposiciones:
    - Al no definirse cómo manejar estos casos, se tuvo en consideración tener una opción para que el usuario que carga el archivo pueda seleccionar actualizar o no la información de usuarios registrados. A partir de esto si hay empleados registrados en el sistema (ya sea que existen desde antes en el sistema o se creó con algún registro del archivo que se sube), el usuario puede escoger si omitir la actualización o no.
- En la reunión se define luego de un debate que se necesita registro de empleados con acceso multisede, pero no se define cual es el criterio para seleccionar la sede principal que se relaciona para el empleado.
  - Preguntas que se podrían realizar:
    - ¿De qué modo o con qué criterio se establece la sede principal de un empleado?
  - Suposiciones:
    - Al no definirse como seleccionar la sede principal de un empleado, se tomó en consideración permitir que el usuario que actualiza la información de un empleado pueda seleccionar cual tomar como sede principal del empleado.
- En la reunión se habla de la forma en que se calcula el aforo en cuanto a la salida, ya que hay situaciones recurrentes en las que los empleados salen por la puerta de emergencia, y se pide proponer una alternativa.
  - Preguntas que se podrían realizar:
    - ¿Existe una forma, o información que ayude a calcular cómo marcar la salida de un empleado si no marca su salida?
  - Suposiciones:
    - En este caso, el cliente pide explícitamente que se proponga la solución, pero no hay una respuesta correcta o una forma clara en la que se pueda usar informacion o algun metodo para marcar la salida sin que se introduzca un parámetro arbitrario (como un número de horas específicas desde la entrada) que pueda conducir a un registro erróneo del aforo. A partir de esto se tomó en cuenta continuar con el reinicio automático a medianoche como se menciona que se ha manejado.
- En la reunión se habla de los reportes, principalmente los de ingresos y salidas a las sedes, se mencionan que filtros se podrían usar y en qué formato de archivo generarlos, pero no se menciona explícitamente qué información debe contener estos reportes. De igual forma, se menciona que “Todo lo que el sistema muestre debe poder descargarse” pero no se expresa explícitamente que es exactamente “todo”.
  - Preguntas que se podrían realizar:
    - ¿Qué información debe ir dentro de los reportes de ingresos y salidas?
    - ¿Qué otros reportes se necesitan y hacia qué información se necesita generar reportes (empleados, registros de acciones en el sistema, sedes, etc.), que filtros se usan para generarlos  y qué información se debe reportar en cada uno?
  - Suposiciones:
    - En este caso, no se expresa explícitamente qué otros reportes además de los de ingresos y salidas se necesita, y qué información debe ir en el reporte. A partir de esto, en primer lugar se toma como supuesto que el reporte de ingresos y salidas debe contener información de empleado, sede, tipo de evento y fecha/hora de cada evento (que es lo más lógico que se necesite verificar). Por otro lado, al no definirse ni mencionar explícitamente reportes de otra información en el sistema que se necesitan, se tomó en cuenta sólo generar reportes de empleados en el sistema (ya que estos pueden ser útiles para validar que empleados se han registrado en el sistema).
- En la reunión no se llegó a tocar el tema de autenticación, que usuarios usarán el sistema y que roles pueden tener en el sistema, o como controlar los permisos y control de acceso al sistema.
  - Preguntas que se podrían realizar:
    - ¿Quién usará esta plataforma, y qué roles podrían existir dentro del sistema?
    - ¿Existe un sistema de autenticación con el que se requiere interactuar?
    - ¿Cómo se puede  definir la matriz de permisos con los roles que se definen?
  - Suposiciones:
    - Este caso no se tocó dentro de la reunión por lo que hay un vacío total en cuanto al manejo de autenticación, por lo que todo lo que se define a continuación son suposiciones. En base a la información que se maneja es muy probable que se necesite autenticación y control de acceso al sistema, como no se definió como implementarlo ni de qué forma lógica controlar el acceso, se definió una autenticación básica con usuarios preestablecidos (sin funcionalidades para agregar mas) basada en roles (suponiendo que un usuario puede tener varios roles) con accesos completo y sin validación de permisos (se incluyen los campos, pero no se usarán para validaciones), aunque se tendra en consideracion poder guardar permisos por rol si en el futuro se necesita implementar la lógica de control de acceso por permisos. Tampoco se manejara relación alguna entre usuarios y empleados, ya que en primer lugar la información de empleados se registra independiente de la del usuario, por lo que en caso de relacionarlo habría que diseñar un mecanismo que vincule esta información, y por otro lado en el alcance actual no existe una finalidad o una razón justificable para llevar a cabo esta relación.
- En la reunión se mencionó que en el archivo se encuentran columnas que probablemente no se necesiten, y se discute si incorporar esta información o no, dejando al final la solución de forma abierta para definir.
  - Preguntas que se podrían realizar:
    - ¿Qué información contienen estos campos y para que se utilizan regularmente?
    - ¿Estos campos pueden llegar a ser útiles para algún proceso?
  - Suposiciones:
    - Para este caso, se dejó abierta la posibilidad de incorporar estos datos o no. Analizando el archivo proporcionado se encontró que existen otros 4 campos más sin mencionar en la reunión, por lo que de estos campos no se sabe si hay que incorporarlos o no. Considerando esto y que algunos campos como nivel de acceso o jornada pueden llegar a ser útiles, se definió dejar estos datos guardados en campos simples que puedan almacenar estos, por si en el futuro se llegan a usar en algún proceso.
# **Consideraciones**
Los siguientes puntos fueron discutidos en la reunión pero no cuentan con suficiente definición para traducirse en historias de usuario dentro del MVP; se documentan para su seguimiento, conforme a lo establecido en el Documento de Alcance:

- Gestión de contratistas y visitantes: se indicó explícitamente que el MVP inicia solo con empleados, aunque se anticipa que esta funcionalidad será solicitada posteriormente.
- Reporte mensual para el ministerio en Panamá: no se definieron los datos ni el formato específico que debe contener; Alberto Sáenz mencionó que podría generarlo él mismo si cuenta con acceso a los datos exportables de ingresos y salidas.
- Aforo por piso/área: se discutió iniciar el control de ocupación por sede, dejando abierta la posibilidad de un mayor nivel de detalle (piso o área) más adelante, sin definir cuándo ni cómo.
- Gestión de información de sedes (crear/actualizar sedes): no se incluyó en el alcance del MVP; dejando las seis sedes identificadas (torre Bogotá, centro de datos Bogotá, Medellín, Cali, Ciudad de Panamá y Chitré).
