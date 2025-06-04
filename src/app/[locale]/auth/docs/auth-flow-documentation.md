# Documentación del Flujo de Autenticación

Este documento describe la implementación del flujo de autenticación en TuFirma Backoffice, siguiendo los principios de Clean Architecture y Domain-Driven Design (DDD).

## Arquitectura General

La implementación sigue una arquitectura de tres capas:

```mermaid
graph TD
    subgraph "Capa de Presentación"
        UI[Componentes UI]
        Store[Store - Zustand]
    end
    
    subgraph "Capa de Dominio"
        Interfaces[Interfaces/Modelos]
        Repositories[Repositorios Abstractos]
    end
    
    subgraph "Capa de Infraestructura"
        RepoImpl[Implementación Repositorios]
        DataSource[API DataSource]
        Mappers[Mappers]
        DTOs[DTOs]
    end
    
    UI --> Store
    Store --> RepoImpl
    RepoImpl --> Repositories
    RepoImpl --> DataSource
    DataSource --> DTOs
    DTOs --> Mappers
    Mappers --> Interfaces
```

## Flujo de Login

El siguiente diagrama muestra el flujo completo del proceso de login:

```mermaid
sequenceDiagram
    participant User as Usuario
    participant UI as LoginPage
    participant Store as AuthStore
    participant Repo as AuthRepositoryImpl
    participant DS as ApiRestDataSource
    participant API as API REST
    
    User->>UI: Introduce credenciales
    UI->>UI: Valida formulario (Zod)
    UI->>Store: login(email, password)
    Store->>Store: set status: 'checking'
    Store->>Repo: login(loginData)
    Repo->>DS: login(loginData)
    DS->>DS: _generateAuthHeader()
    DS->>API: POST /auth/signin
    API->>DS: Response (token + user)
    DS->>DS: AuthMapper.toLoginResponseDto()
    DS->>Repo: ILoginResponse
    Repo->>Store: ILoginResponse
    Store->>Store: set status: 'authenticated'
    Store->>Store: Almacena token y usuario
    Store->>UI: Actualiza estado
    UI->>User: Redirección a Dashboard
```

## Flujo de Registro

```mermaid
sequenceDiagram
    participant User as Usuario
    participant UI as RegisterPage
    participant Store as AuthStore
    participant Repo as AuthRepositoryImpl
    participant DS as ApiRestDataSource
    participant API as API REST
    
    User->>UI: Completa formulario
    UI->>UI: Valida formulario (Zod)
    UI->>Store: register(registerData)
    Store->>Store: set status: 'checking'
    Store->>Repo: register(registerData)
    Repo->>DS: register(registerData)
    DS->>DS: AuthMapper.toRegisterDto()
    DS->>API: POST /auth/register
    API->>DS: Response (message)
    DS->>Repo: IResponseMessage
    Repo->>Store: IResponseMessage
    Store->>Store: set status: 'not-authenticated'
    Store->>UI: Actualiza estado
    UI->>User: Muestra mensaje de éxito
```

## Flujo de Recuperación de Contraseña

```mermaid
sequenceDiagram
    participant User as Usuario
    participant UI as ForgotPasswordPage
    participant Store as AuthStore
    participant Repo as AuthRepositoryImpl
    participant DS as ApiRestDataSource
    participant API as API REST
    
    User->>UI: Introduce email
    UI->>UI: Valida email (Zod)
    UI->>Store: forgotPassword(email)
    Store->>Store: set status: 'checking'
    Store->>Repo: forgotPassword(data)
    Repo->>DS: forgotPassword(data)
    DS->>API: POST /auth/recovery-code
    API->>DS: Response (message)
    DS->>Repo: IResponseMessage
    Repo->>Store: IResponseMessage
    Store->>Store: set successMessage
    Store->>UI: Actualiza estado
    UI->>User: Muestra mensaje de éxito
```

## Flujo de Cambio de Contraseña

```mermaid
sequenceDiagram
    participant User as Usuario
    participant UI as ChangePasswordPage
    participant Store as AuthStore
    participant Repo as AuthRepositoryImpl
    participant DS as ApiRestDataSource
    participant API as API REST
    
    User->>UI: Introduce código y nueva contraseña
    UI->>UI: Valida formulario (Zod)
    UI->>Store: resetPassword(data)
    Store->>Store: set status: 'checking'
    Store->>Repo: resetPassword(data)
    Repo->>DS: resetPassword(data)
    DS->>API: POST /auth/reset-password
    API->>DS: Response (message)
    DS->>Repo: IResponseMessage
    Repo->>Store: IResponseMessage
    Store->>Store: set successMessage
    Store->>UI: Actualiza estado
    UI->>User: Muestra mensaje de éxito
```

## Flujo de Validación de Cuenta

```mermaid
sequenceDiagram
    participant User as Usuario
    participant UI as ValidateAccountPage
    participant Store as AuthStore
    participant Repo as AuthRepositoryImpl
    participant DS as ApiRestDataSource
    participant API as API REST
    
    User->>UI: Introduce código de verificación
    UI->>UI: Valida código (Zod)
    UI->>Store: validateAccount(data)
    Store->>Repo: validateAccount(data)
    Repo->>DS: validateAccount(data)
    DS->>API: POST /auth/activate-account
    API->>DS: Response (message)
    DS->>Repo: IResponseMessage
    Repo->>Store: IResponseMessage
    Store->>UI: Actualiza estado
    UI->>User: Muestra mensaje de éxito
```

## Manejo de Tokens y Sesión

```mermaid
graph TD
    subgraph "Almacenamiento de Tokens"
        Login[Login Exitoso]
        Token[Token JWT]
        Cookie[Cookie auth_token]
        Storage[Zustand Persist Storage]
        Logout[Logout]
        
        Login --> Token
        Token --> Cookie
        Token --> Storage
        Logout --> ClearCookie[Eliminar Cookie]
        Logout --> ClearStorage[Limpiar Storage]
    end
    
    subgraph "Verificación de Sesión"
        Check[checkAuthStatus]
        GetCookie[Obtener Cookie]
        Decode[Decodificar Token]
        SetState[Establecer Estado]
        
        Check --> GetCookie
        GetCookie --> Decode
        Decode --> SetState
    end
```

## Estructura de Archivos

```mermaid
graph TD
    Auth[auth/]
    Domain[domain/]
    Infra[infrastructure/]
    Pres[presentation/]
    
    Auth --> Domain
    Auth --> Infra
    Auth --> Pres
    
    Domain --> DomainInterfaces[interfaces/]
    Domain --> DomainRepos[repositories/]
    
    Infra --> InfraDatasources[datasources/]
    Infra --> InfraRepos[repositories/]
    Infra --> InfraDtos[dtos/]
    Infra --> InfraMappers[mappers/]
    
    Pres --> PresPages[pages/]
    Pres --> PresComponents[components/]
    Pres --> PresStore[store/]
    
    PresPages --> Login[login/]
    PresPages --> Register[register/]
    PresPages --> ForgotPassword[forgot-password/]
    PresPages --> ChangePassword[change-password/]
    PresPages --> ValidateAccount[validate-account/]
    
    PresStore --> AuthStore[auth.store.ts]
    PresStore --> AuthTypes[auth.types.ts]
```

## Validación de Formularios

La validación de formularios utiliza Zod con soporte para traducciones:

```mermaid
graph TD
    Form[Formulario]
    Schema[Esquema Zod]
    Translations[Traducciones]
    Validation[Validación]
    Errors[Errores]
    
    Form --> Schema
    Translations --> Schema
    Schema --> Validation
    Validation --> Errors
    Errors --> Form
```

## Manejo de Errores

```mermaid
graph TD
    API[API Error]
    DataSource[DataSource]
    Repository[Repository]
    Store[Store]
    UI[UI Component]
    
    API --> DataSource
    DataSource --> Repository
    Repository --> Store
    Store --> UI
    
    Store --> ErrorState[Error State]
    ErrorState --> Notification[Notification System]
    Notification --> User[Usuario]
```

## Mejoras Futuras

- Implementar casos de uso (Use Cases) específicos
- Añadir tests unitarios para cada capa
- Implementar un sistema de manejo de errores más específico
- Considerar un sistema de inyección de dependencias
