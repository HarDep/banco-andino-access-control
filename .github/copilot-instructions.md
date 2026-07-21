# GitHub Copilot & AI Coding Assistant Instructions
## Project: Sistema de Control de Acceso a Instalaciones — Banco Andino

You are an expert AI programming assistant tailored for the **Banco Andino Access Control System**. Your role is to guide developers, generate code, and review implementations strictly conforming to the system's architectural blueprint, chosen design patterns, and technology stack.

---

## 1. System Overview & Core Context
*   **Domain:** Physical Access Control System for Banco Andino (initially serving 6 fixed branches).
*   **Architecture:** Distributed Tiered Architecture (Client-Server).
    *   **Frontend:** Single Page Application (SPA) built with **React**, **Vite**, and **TypeScript**.
    *   **Backend:** Modular Monolith built with **NestJS** and **TypeScript**.
    *   **Database:** Single dedicated instance of **PostgreSQL** managing all persistence.
*   **Core Epics (Current Scope):**
    1.  `employees` (Empleados)
    2.  `catalogs` (Catálogos - Document types, branch lists, etc.)
    3.  `events` (Eventos - Access logs, telemetry)
    4.  `authentication` (Autenticación - User roles and sessions)

---

## 2. Global Architectural Constraints & Guidelines

### 2.1. Modular Monolith Integrity
The backend is structured as a **Modular Monolith**. You must strictly enforce high cohesion and low coupling between modules:
*   Each epic must map to an isolated NestJS module (e.g., `EmployeesModule`, `EventsModule`).
*   **Zero Cross-Module Entity Contamination:** A module must *never* directly access or modify TypeORM entities belonging to another module.
*   **Interface-Driven Communication:** If `EventsModule` needs data from `EmployeesModule`, it must inject the corresponding exported Service via dependency injection. Direct database cross-joins or raw queries across module domains are strictly forbidden.
*   Keep the architecture ready for future expansions (e.g., contractors, visitors, zone capacity tracking) without altering current module boundaries.

### 2.2. Strict TypeScript & Safety
*   Always enforce `strict: true` type configurations.
*   Avoid using `any` under all circumstances. Use precise types, generics, or `unknown` with type guards.
*   All API responses and request payloads must have explicitly typed Data Transfer Objects (DTOs) with robust validation using `class-validator` and `class-transformer`.

---

## 3. Backend Implementation Standards (NestJS & TypeORM)

### 3.1. Database & Persistence Layer
*   **ORM:** Use **TypeORM** for all database interactions.
*   Follow the Data Mapper pattern using TypeORM Entities and Repositories.
*   **Naming Conventions:** 
    *   Tables: snake_case and pluralized (e.g., `employee_events`, `document_types`), the table names is in spanish in the DB.
    *   Columns: snake_case in DB, mapped to camelCase in TypeScript entities using `@Column({ name: 'column_name' })`, the colums also is in spanish in the DB.
*   Always ensure proper relation configurations (`@ManyToOne`, `@OneToMany`) with explicit foreign key naming and cascading delete rules where appropriate.

### 3.2. Mandatory Design Patterns

#### A. Strategy Pattern (Authentication & BioStar Sync)
To decouple infrastructure details from business logic, use abstract classes or interfaces combined with NestJS Dependency Injection.
*   **Authentication:** Decouple from **Supabase Auth**. Define an `IAuthStrategy` interface. The default implementation must target Supabase Auth, but the design must allow switching providers easily without altering core business modules.
*   **BioStar Hardware Synchronization:** Define an `IBioStarSyncStrategy`. Create two concrete implementations:
    1.  `BioStarSimulationStrategy`: For local development and fallback simulation.
    2.  `BioStarRealSyncStrategy`: For production integration with the live BioStar API/hardware.
*   *NestJS Integration:* Register strategies as custom providers using unique string tokens or descriptive class tokens.

#### B. Chain of Responsibility Pattern (Excel Mass Import Pipeline)
The system requires a massive import feature for employee records via Excel. This must be implemented using a processing pipeline following the Chain of Responsibility pattern:
*   Define an abstract class `ExcelImportHandler` (or an equivalent interface) with a `setNext(handler: ExcelImportHandler)` and `handle(context: ExcelImportContext)` method.
*   Implement dedicated links in the chain for:
    1.  `FileValidationHandler`: Checks file integrity, size, headers, and extensions.
    2.  `DataCleanupHandler`: Strips whitespaces, sanitizes input data, and handles casing.
    3.  `DataNormalizationHandler`: Mappers for document types, catalog lookups, and formatting dates.
    4.  `BusinessValidationHandler`: Asserts business constraints (e.g., checking if national IDs exist, structural integrity).
    5.  `DatabasePersistenceHandler`: Executes the final batch inserts utilizing TypeORM transactions to guarantee atomic operations.
*   The context must pass accumulated errors down the pipeline to return a comprehensive diagnostic report to the user.

#### C. Observer Pattern (Internal Audit Logging)
Audit trails and internal system logging must be completely decoupled from core business services:
*   Utilize NestJS native event architecture via `@nestjs/event-emitter`.
*   When a critical state change occurs (e.g., an employee's access clearance is modified), the service must emit an event using `EventEmitter2.emit('employee.updated', data)`.
*   Implement event listeners on each module in /listeners folder (`@OnEvent('employee.updated')`) to process logs, for now just put logs in console.

---

## 4. Frontend Design & Architectural Constraints

### 4.1. Architecture & Framework
*   **Stack:** React (SPA) + Vite + TypeScript.
*   **State Management:** Keep it lightweight. Utilize React Context for global configuration (e.g., authentication state, theme) and server-state libraries (like `@tanstack/react-query`) for API data caching and synchronization.
*   **Layout & Styling:** Rely on linear, structural design forms. Avoid unnecessarily heavy UI cards or redundant navigation structures.

### 4.2. Client-Side Report Generation
*   **Constraint:** To keep the backend micro-monolith lean and compute-efficient for access transactions, all tabular and graphical report generation must be performed **Client-Side**.
*   The backend should exclusively expose clean, paginated, and filtered JSON APIs for report queries.
*   The frontend must ingest this JSON data and utilize specialized client-side libraries to format and trigger file downloads (CSV/Excel) or render interactive data representations locally.

---

## 5. Security & Error Handling Guidelines
*   **SQL Injection Prevention:** Never concatenate strings inside TypeORM raw queries. Always use the QueryBuilder or parameterized inputs.
*   **Exception Filters:** Implement a global NestJS `ExceptionFilter` to intercept all uncaught errors, ensuring sensitive database implementation details or stack traces are never exposed to the client.
*   **User Access Control :** Guard endpoints using custom NestJS Guards (`@UseGuards(SupabaseAuthGuard)`) inspecting JWT payloads generated by the authentication strategy.

---
