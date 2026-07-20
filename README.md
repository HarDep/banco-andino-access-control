# Sistema de Control de Acceso a Instalaciones - Banco Andino

Este es el monorepo que contiene el backend (NestJS) y frontend (React + Vite) para el sistema de control de acceso.

## Requisitos previos

- Node.js 20+
- pnpm (instalado globalmente: `npm install -g pnpm`)
- Docker y Docker Compose (opcional, para despliegue contenerizado)

## Instalación y ejecución en desarrollo

1. Clona el repositorio:
   ```bash
   git clone https://github.com/HarDep/banco-andino-access-control.git
   cd banco-andino-access-control
   ```

2. Instala las dependencias:
   ```bash
   pnpm install
   ```

3. Configura las variables de entorno. Crea un archivo **.env** en la raíz (copia de **.env.example**) y ajusta las variables según tu entorno.

4. Ejecuta la aplicación en modo de desarrollo:
   ```bash
   pnpm run dev
   ```
   Esto levantará:
    * Backend en http://localhost:3000
    * Frontend en http://localhost:5173

## Comandos útiles

   * `pnpm run build` – compila ambos paquetes.
   * `pnpm run test` – ejecuta todas las pruebas (backend y frontend).
   * `pnpm run lint` – ejecuta el linter en ambos.

## Despliegue contenerizado con Docker y Docker Compose

1. Debes tener instalado Docker y Docker Compose.

2. Ejecuta el comando `docker compose up --build` para levantar el sistema.

   La aplicación estará disponible en:
    * Frontend: http://localhost
    * Backend: http://localhost:3000