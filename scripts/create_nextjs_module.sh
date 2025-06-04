#!/bin/bash

# Function to convert to PascalCase
to_pascal_case() {
    local input="$1"
    
    # Replace underscores with spaces, then capitalize each word, then remove spaces
    local pascal=$(echo "$input" | tr '_' ' ' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1' | tr -d ' ')
    
    echo "$pascal"
}

# Function to convert to snake_case
to_snake_case() {
    echo "$1" | sed -r 's/([A-Z])/_\L\1/g' | sed 's/^_//'
}

# Function to convert to camelCase
to_camel_case() {
    local input="$1"
    local camel=$(echo "$input" | tr '_' ' ' | awk '{for(i=1;i<=NF;i++) if(i==1) $i=tolower($i); else $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1' | tr -d ' ')
    echo "$camel"
}

# Check if module name is provided
if [ -z "$1" ]; then
    echo "Please provide a module name"
    echo "Usage: ./create_nextjs_module.sh module_name"
    exit 1
fi

MODULE_NAME=$(to_snake_case "$1")
MODULE_NAME_PASCAL=$(to_pascal_case "$1")
MODULE_NAME_CAMEL=$(to_camel_case "$1")

# Base directory for the module
BASE_DIR="src/app/[locale]/(dashboard)/dashboard/$MODULE_NAME"

# Create directory structure
mkdir -p "$BASE_DIR/(presentation)/components"
mkdir -p "$BASE_DIR/(presentation)/store"
mkdir -p "$BASE_DIR/domain/enums"
mkdir -p "$BASE_DIR/domain/interfaces"
mkdir -p "$BASE_DIR/domain/repositories"
mkdir -p "$BASE_DIR/domain/validations"
mkdir -p "$BASE_DIR/infrastructure/datasources"
mkdir -p "$BASE_DIR/infrastructure/dtos"
mkdir -p "$BASE_DIR/infrastructure/mappers"
mkdir -p "$BASE_DIR/infrastructure/repositories"
mkdir -p "$BASE_DIR/infrastructure/services"

# Create domain files

# Create enums
cat > "$BASE_DIR/domain/enums/${MODULE_NAME}.enum.ts" << EOL
export enum E${MODULE_NAME_PASCAL}Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

// Add more enums as needed
EOL

# Create interfaces
cat > "$BASE_DIR/domain/interfaces/${MODULE_NAME}.interface.ts" << EOL
export interface I${MODULE_NAME_PASCAL} {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface I${MODULE_NAME_PASCAL}Create {
  name: string;
  description: string;
  status: string;
}

export interface I${MODULE_NAME_PASCAL}Update {
  name: string;
  description: string;
  status: string;
}

export interface I${MODULE_NAME_PASCAL}Response {
  ${MODULE_NAME}s: I${MODULE_NAME_PASCAL}[];
  total: number;
  page: number;
  limit: number;
}
EOL

# Create repository interface
cat > "$BASE_DIR/domain/repositories/${MODULE_NAME}.repository.ts" << EOL
import { IResponseMessage } from '@/core';
import { I${MODULE_NAME_PASCAL}, I${MODULE_NAME_PASCAL}Create, I${MODULE_NAME_PASCAL}Response, I${MODULE_NAME_PASCAL}Update } from '../interfaces';

export abstract class ${MODULE_NAME_PASCAL}Repository {
  abstract get${MODULE_NAME_PASCAL}s(page: number, limit: number): Promise<I${MODULE_NAME_PASCAL}Response>;
  abstract get${MODULE_NAME_PASCAL}ById(id: string): Promise<I${MODULE_NAME_PASCAL}>;
  abstract create${MODULE_NAME_PASCAL}(${MODULE_NAME}: I${MODULE_NAME_PASCAL}Create): Promise<IResponseMessage>;
  abstract update${MODULE_NAME_PASCAL}(id: string, ${MODULE_NAME}: I${MODULE_NAME_PASCAL}Update): Promise<IResponseMessage>;
  abstract delete${MODULE_NAME_PASCAL}(id: string): Promise<IResponseMessage>;
  abstract activate${MODULE_NAME_PASCAL}(id: string): Promise<IResponseMessage>;
  abstract deactivate${MODULE_NAME_PASCAL}(id: string): Promise<IResponseMessage>;
}
EOL

# Create validation schema
cat > "$BASE_DIR/domain/validations/${MODULE_NAME}-schema.ts" << EOL
import { z } from 'zod';

export interface ${MODULE_NAME_PASCAL}FormValues {
  name: string;
  description: string;
  status: string;
}

interface ValidationMessages {
  name?: {
    required?: string;
  };
  description?: {
    required?: string;
  };
  status?: {
    required?: string;
  };
}

export const ${MODULE_NAME}FormSchema = (messages: ValidationMessages = {}) => {
  return z.object({
    name: z.string({
      required_error: messages.name?.required || 'Name is required',
    }),
    description: z.string({
      required_error: messages.description?.required || 'Description is required',
    }),
    status: z.string({
      required_error: messages.status?.required || 'Status is required',
    }),
  });
};
EOL

# Create index files for domain
cat > "$BASE_DIR/domain/enums/index.ts" << EOL
export * from './${MODULE_NAME}.enum';
EOL

cat > "$BASE_DIR/domain/interfaces/index.ts" << EOL
export * from './${MODULE_NAME}.interface';
EOL

cat > "$BASE_DIR/domain/repositories/index.ts" << EOL
export * from './${MODULE_NAME}.repository';
EOL

cat > "$BASE_DIR/domain/index.ts" << EOL
export * from './enums';
export * from './interfaces';
export * from './repositories';
export * from './validations/${MODULE_NAME}-schema';
EOL

# Create infrastructure files

# Create DTOs
cat > "$BASE_DIR/infrastructure/dtos/${MODULE_NAME}.dto.ts" << EOL
/**
 * DTOs para el módulo de ${MODULE_NAME}
 * Estos objetos se utilizan para la comunicación con el API
 */

export interface ${MODULE_NAME_PASCAL}Dto {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ${MODULE_NAME_PASCAL}CreateDto {
  name: string;
  description: string;
  status: string;
}

export interface ${MODULE_NAME_PASCAL}UpdateDto {
  name: string;
  description: string;
  status: string;
}

export interface ${MODULE_NAME_PASCAL}ResponseDto {
  data: ${MODULE_NAME_PASCAL}Dto[];
  page: number;
  per_page: number;
  total_count: number;
}
EOL

# Create mappers
cat > "$BASE_DIR/infrastructure/mappers/${MODULE_NAME}.mapper.ts" << EOL
import { I${MODULE_NAME_PASCAL}, I${MODULE_NAME_PASCAL}Create, I${MODULE_NAME_PASCAL}Response, I${MODULE_NAME_PASCAL}Update } from '../../domain/interfaces';
import { ${MODULE_NAME_PASCAL}CreateDto, ${MODULE_NAME_PASCAL}Dto, ${MODULE_NAME_PASCAL}ResponseDto, ${MODULE_NAME_PASCAL}UpdateDto } from '../dtos';

/**
 * ${MODULE_NAME_PASCAL}Mapper
 * Responsable de transformar modelos de dominio a DTOs y viceversa
 */
export class ${MODULE_NAME_PASCAL}Mapper {
  /**
   * Convierte un DTO a un modelo de dominio
   * @param dto DTO desde la API
   * @returns Modelo de dominio
   */
  static toDomain(dto: ${MODULE_NAME_PASCAL}Dto): I${MODULE_NAME_PASCAL} {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      status: dto.status,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    };
  }

  /**
   * Convierte una respuesta DTO a un modelo de dominio
   * @param responseDto DTO de respuesta desde la API
   * @param requestedPage Página solicitada originalmente
   * @param requestedLimit Límite solicitado originalmente
   * @returns Modelo de dominio de respuesta
   */
  static to${MODULE_NAME_PASCAL}ResponseDomain(responseDto: ${MODULE_NAME_PASCAL}ResponseDto, requestedPage?: number, requestedLimit?: number): I${MODULE_NAME_PASCAL}Response {
    return {
      ${MODULE_NAME}s: responseDto.data.map(this.toDomain),
      total: responseDto.total_count,
      page: requestedPage !== undefined ? requestedPage : responseDto.page,
      limit: requestedLimit !== undefined ? requestedLimit : responseDto.per_page,
    };
  }

  /**
   * Convierte un modelo de dominio de creación a un DTO
   * @param model Modelo de dominio para crear
   * @returns DTO formateado para la API
   */
  static toCreateDto(model: I${MODULE_NAME_PASCAL}Create): ${MODULE_NAME_PASCAL}CreateDto {
    return {
      name: model.name,
      description: model.description,
      status: model.status,
    };
  }

  /**
   * Convierte un modelo de dominio de actualización a un DTO
   * @param model Modelo de dominio para actualizar
   * @returns DTO formateado para la API
   */
  static toUpdateDto(model: I${MODULE_NAME_PASCAL}Update): ${MODULE_NAME_PASCAL}UpdateDto {
    return {
      name: model.name,
      description: model.description,
      status: model.status,
    };
  }
}
EOL

# Create datasource
cat > "$BASE_DIR/infrastructure/datasources/api.rest.datasource.ts" << EOL
import { IResponseMessage } from '@/core';
import { httpClient } from '@/core/network';
import { ${MODULE_NAME_PASCAL}Repository } from '../../domain/repositories';
import { I${MODULE_NAME_PASCAL}, I${MODULE_NAME_PASCAL}Create, I${MODULE_NAME_PASCAL}Response, I${MODULE_NAME_PASCAL}Update } from '../../domain/interfaces';
import { ${MODULE_NAME_PASCAL}CreateDto, ${MODULE_NAME_PASCAL}Dto, ${MODULE_NAME_PASCAL}ResponseDto, ${MODULE_NAME_PASCAL}UpdateDto } from '../dtos';
import { ${MODULE_NAME_PASCAL}Mapper } from '../mappers/${MODULE_NAME}.mapper';

export class ApiRestDataSource implements ${MODULE_NAME_PASCAL}Repository {
  constructor() {}

  async get${MODULE_NAME_PASCAL}s(page: number, limit: number): Promise<I${MODULE_NAME_PASCAL}Response> {
    try {
      console.log(\`Solicitando página \${page}, límite \${limit}\`);

      const response = await httpClient.get<${MODULE_NAME_PASCAL}ResponseDto>(\`/${MODULE_NAME}s/\${limit}/\${page}\`);
      return ${MODULE_NAME_PASCAL}Mapper.to${MODULE_NAME_PASCAL}ResponseDomain(response.data, page, limit);
    } catch (error) {
      console.error('Error fetching ${MODULE_NAME}s:', error);
      throw error;
    }
  }

  async get${MODULE_NAME_PASCAL}ById(id: string): Promise<I${MODULE_NAME_PASCAL}> {
    try {
      const response = await httpClient.get<${MODULE_NAME_PASCAL}Dto>(\`/${MODULE_NAME}s/\${id}\`);
      return ${MODULE_NAME_PASCAL}Mapper.toDomain(response.data);
    } catch (error) {
      console.error(\`Error fetching ${MODULE_NAME} with id \${id}:\`, error);
      throw error;
    }
  }

  async create${MODULE_NAME_PASCAL}(${MODULE_NAME}: I${MODULE_NAME_PASCAL}Create): Promise<IResponseMessage> {
    try {
      const dto = ${MODULE_NAME_PASCAL}Mapper.toCreateDto(${MODULE_NAME});
      const response = await httpClient.post<${MODULE_NAME_PASCAL}CreateDto, IResponseMessage>('/${MODULE_NAME}s', dto);
      return response.data;
    } catch (error) {
      console.error('Error creating ${MODULE_NAME}:', error);
      throw error;
    }
  }

  async update${MODULE_NAME_PASCAL}(id: string, ${MODULE_NAME}: I${MODULE_NAME_PASCAL}Update): Promise<IResponseMessage> {
    try {
      const dto = ${MODULE_NAME_PASCAL}Mapper.toUpdateDto(${MODULE_NAME});
      const response = await httpClient.put<${MODULE_NAME_PASCAL}UpdateDto, IResponseMessage>(\`/${MODULE_NAME}s/\${id}\`, dto);
      return response.data;
    } catch (error) {
      console.error(\`Error updating ${MODULE_NAME} with id \${id}:\`, error);
      throw error;
    }
  }

  async delete${MODULE_NAME_PASCAL}(id: string): Promise<IResponseMessage> {
    try {
      const response = await httpClient.delete<IResponseMessage>(\`/${MODULE_NAME}s/\${id}\`);
      return response.data;
    } catch (error) {
      console.error(\`Error deleting ${MODULE_NAME} with id \${id}:\`, error);
      throw error;
    }
  }

  async activate${MODULE_NAME_PASCAL}(id: string): Promise<IResponseMessage> {
    try {
      const response = await httpClient.patch<IResponseMessage>(\`/${MODULE_NAME}s/\${id}/activate\`);
      return response.data;
    } catch (error) {
      console.error(\`Error activating ${MODULE_NAME} with id \${id}:\`, error);
      throw error;
    }
  }

  async deactivate${MODULE_NAME_PASCAL}(id: string): Promise<IResponseMessage> {
    try {
      const response = await httpClient.patch<IResponseMessage>(\`/${MODULE_NAME}s/\${id}/deactivate\`);
      return response.data;
    } catch (error) {
      console.error(\`Error deactivating ${MODULE_NAME} with id \${id}:\`, error);
      throw error;
    }
  }
}
EOL

# Create repository implementation
cat > "$BASE_DIR/infrastructure/repositories/${MODULE_NAME}.repository.impl.ts" << EOL
import { IResponseMessage } from '@/core';
import { ${MODULE_NAME_PASCAL}Repository } from '../../domain/repositories';
import { I${MODULE_NAME_PASCAL}, I${MODULE_NAME_PASCAL}Create, I${MODULE_NAME_PASCAL}Response, I${MODULE_NAME_PASCAL}Update } from '../../domain/interfaces';
import { ApiRestDataSource } from '../datasources/api.rest.datasource';

/**
 * Implementación del repositorio de ${MODULE_NAME}
 * Responsable de la comunicación con la API
 */
export class ${MODULE_NAME_PASCAL}RepositoryImpl implements ${MODULE_NAME_PASCAL}Repository {
  constructor(private readonly dataSource: ApiRestDataSource) {}

  /**
   * Obtiene la lista paginada
   * @param page Número de página
   * @param limit Límite de registros por página
   * @returns Respuesta con elementos y metadatos de paginación
   */
  async get${MODULE_NAME_PASCAL}s(page: number, limit: number): Promise<I${MODULE_NAME_PASCAL}Response> {
    try {
      return await this.dataSource.get${MODULE_NAME_PASCAL}s(page, limit);
    } catch (error) {
      console.error('Error fetching ${MODULE_NAME}s:', error);
      throw error;
    }
  }

  /**
   * Obtiene un elemento por su ID
   * @param id ID del elemento
   * @returns Datos del elemento
   */
  async get${MODULE_NAME_PASCAL}ById(id: string): Promise<I${MODULE_NAME_PASCAL}> {
    try {
      return await this.dataSource.get${MODULE_NAME_PASCAL}ById(id);
    } catch (error) {
      console.error(\`Error fetching ${MODULE_NAME} with id \${id}:\`, error);
      throw error;
    }
  }

  /**
   * Crea un nuevo elemento
   * @param data Datos del elemento a crear
   * @returns Mensaje de respuesta
   */
  async create${MODULE_NAME_PASCAL}(data: I${MODULE_NAME_PASCAL}Create): Promise<IResponseMessage> {
    try {
      return await this.dataSource.create${MODULE_NAME_PASCAL}(data);
    } catch (error) {
      console.error('Error creating ${MODULE_NAME}:', error);
      throw error;
    }
  }

  /**
   * Actualiza un elemento existente
   * @param id ID del elemento
   * @param data Datos actualizados
   * @returns Mensaje de respuesta
   */
  async update${MODULE_NAME_PASCAL}(id: string, data: I${MODULE_NAME_PASCAL}Update): Promise<IResponseMessage> {
    try {
      return await this.dataSource.update${MODULE_NAME_PASCAL}(id, data);
    } catch (error) {
      console.error(\`Error updating ${MODULE_NAME} with id \${id}:\`, error);
      throw error;
    }
  }

  /**
   * Elimina un elemento
   * @param id ID del elemento a eliminar
   * @returns Mensaje de respuesta
   */
  async delete${MODULE_NAME_PASCAL}(id: string): Promise<IResponseMessage> {
    try {
      return await this.dataSource.delete${MODULE_NAME_PASCAL}(id);
    } catch (error) {
      console.error(\`Error deleting ${MODULE_NAME} with id \${id}:\`, error);
      throw error;
    }
  }

  /**
   * Activa un elemento
   * @param id ID del elemento
   * @returns Mensaje de respuesta
   */
  async activate${MODULE_NAME_PASCAL}(id: string): Promise<IResponseMessage> {
    try {
      return await this.dataSource.activate${MODULE_NAME_PASCAL}(id);
    } catch (error) {
      console.error(\`Error activating ${MODULE_NAME} with id \${id}:\`, error);
      throw error;
    }
  }

  /**
   * Desactiva un elemento
   * @param id ID del elemento
   * @returns Mensaje de respuesta
   */
  async deactivate${MODULE_NAME_PASCAL}(id: string): Promise<IResponseMessage> {
    try {
      return await this.dataSource.deactivate${MODULE_NAME_PASCAL}(id);
    } catch (error) {
      console.error(\`Error deactivating ${MODULE_NAME} with id \${id}:\`, error);
      throw error;
    }
  }
}
EOL

# Create service
cat > "$BASE_DIR/infrastructure/services/${MODULE_NAME}.service.ts" << EOL
import { IResponseMessage } from '@/core';
import { I${MODULE_NAME_PASCAL}, I${MODULE_NAME_PASCAL}Create, I${MODULE_NAME_PASCAL}Response, I${MODULE_NAME_PASCAL}Update } from '../../domain/interfaces';
import { ${MODULE_NAME_PASCAL}RepositoryImpl } from '../repositories/${MODULE_NAME}.repository.impl';
import { ApiRestDataSource } from '../datasources/api.rest.datasource';

/**
 * Servicio que maneja las operaciones de ${MODULE_NAME}
 * Actúa como una fachada para la implementación del repositorio
 */
export class ${MODULE_NAME_PASCAL}Service {
  private static repository = new ${MODULE_NAME_PASCAL}RepositoryImpl(new ApiRestDataSource());

  /**
   * Obtiene la lista paginada
   * @param page Número de página
   * @param limit Límite de registros por página
   * @returns Promesa con la respuesta
   */
  static async get${MODULE_NAME_PASCAL}s(page: number, limit: number): Promise<I${MODULE_NAME_PASCAL}Response> {
    try {
      return await this.repository.get${MODULE_NAME_PASCAL}s(page, limit);
    } catch (error) {
      console.error('Error in ${MODULE_NAME_PASCAL}Service.get${MODULE_NAME_PASCAL}s:', error);
      throw error;
    }
  }

  /**
   * Obtiene un elemento por su ID
   * @param id ID del elemento
   * @returns Promesa con los datos
   */
  static async get${MODULE_NAME_PASCAL}ById(id: string): Promise<I${MODULE_NAME_PASCAL}> {
    try {
      return await this.repository.get${MODULE_NAME_PASCAL}ById(id);
    } catch (error) {
      console.error(\`Error in ${MODULE_NAME_PASCAL}Service.get${MODULE_NAME_PASCAL}ById for id \${id}:\`, error);
      throw error;
    }
  }

  /**
   * Crea un nuevo elemento
   * @param data Datos a crear
   * @returns Promesa con el mensaje de respuesta
   */
  static async create${MODULE_NAME_PASCAL}(data: I${MODULE_NAME_PASCAL}Create): Promise<IResponseMessage> {
    try {
      return await this.repository.create${MODULE_NAME_PASCAL}(data);
    } catch (error) {
      console.error('Error in ${MODULE_NAME_PASCAL}Service.create${MODULE_NAME_PASCAL}:', error);
      throw error;
    }
  }

  /**
   * Actualiza un elemento existente
   * @param id ID del elemento
   * @param data Datos actualizados
   * @returns Promesa con el mensaje de respuesta
   */
  static async update${MODULE_NAME_PASCAL}(id: string, data: I${MODULE_NAME_PASCAL}Update): Promise<IResponseMessage> {
    try {
      return await this.repository.update${MODULE_NAME_PASCAL}(id, data);
    } catch (error) {
      console.error(\`Error in ${MODULE_NAME_PASCAL}Service.update${MODULE_NAME_PASCAL} for id \${id}:\`, error);
      throw error;
    }
  }

  /**
   * Elimina un elemento
   * @param id ID del elemento
   * @returns Promesa con el mensaje de respuesta
   */
  static async delete${MODULE_NAME_PASCAL}(id: string): Promise<IResponseMessage> {
    try {
      return await this.repository.delete${MODULE_NAME_PASCAL}(id);
    } catch (error) {
      console.error(\`Error in ${MODULE_NAME_PASCAL}Service.delete${MODULE_NAME_PASCAL} for id \${id}:\`, error);
      throw error;
    }
  }

  /**
   * Activa un elemento
   * @param id ID del elemento
   * @returns Promesa con el mensaje de respuesta
   */
  static async activate${MODULE_NAME_PASCAL}(id: string): Promise<IResponseMessage> {
    try {
      return await this.repository.activate${MODULE_NAME_PASCAL}(id);
    } catch (error) {
      console.error(\`Error in ${MODULE_NAME_PASCAL}Service.activate${MODULE_NAME_PASCAL} for id \${id}:\`, error);
      throw error;
    }
  }

  /**
   * Desactiva un elemento
   * @param id ID del elemento
   * @returns Promesa con el mensaje de respuesta
   */
  static async deactivate${MODULE_NAME_PASCAL}(id: string): Promise<IResponseMessage> {
    try {
      return await this.repository.deactivate${MODULE_NAME_PASCAL}(id);
    } catch (error) {
      console.error(\`Error in ${MODULE_NAME_PASCAL}Service.deactivate${MODULE_NAME_PASCAL} for id \${id}:\`, error);
      throw error;
    }
  }
}
EOL

# Create index files for infrastructure
cat > "$BASE_DIR/infrastructure/datasources/index.ts" << EOL
export * from './api.rest.datasource';
EOL

cat > "$BASE_DIR/infrastructure/dtos/index.ts" << EOL
export * from './${MODULE_NAME}.dto';
EOL

cat > "$BASE_DIR/infrastructure/mappers/index.ts" << EOL
export * from './${MODULE_NAME}.mapper';
EOL

cat > "$BASE_DIR/infrastructure/repositories/index.ts" << EOL
export * from './${MODULE_NAME}.repository.impl';
EOL

cat > "$BASE_DIR/infrastructure/services/index.ts" << EOL
export * from './${MODULE_NAME}.service';
EOL

cat > "$BASE_DIR/infrastructure/index.ts" << EOL
export * from './datasources';
export * from './dtos';
export * from './mappers';
export * from './repositories';
export * from './services';
EOL

# Create presentation files

# Create store types
cat > "$BASE_DIR/(presentation)/store/${MODULE_NAME}s.types.ts" << EOL
import { I${MODULE_NAME_PASCAL}, I${MODULE_NAME_PASCAL}Create, I${MODULE_NAME_PASCAL}Update } from '../../domain';

/**
 * Estado del store de ${MODULE_NAME}
 */
export interface ${MODULE_NAME_PASCAL}sState {
  ${MODULE_NAME}s: I${MODULE_NAME_PASCAL}[];
  selected${MODULE_NAME_PASCAL}: I${MODULE_NAME_PASCAL} | null;
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
}

/**
 * Acciones disponibles en el store de ${MODULE_NAME}
 */
export interface ${MODULE_NAME_PASCAL}sActions {
  // Acciones de consulta
  get${MODULE_NAME_PASCAL}s: (page?: number, limit?: number) => Promise<void>;
  get${MODULE_NAME_PASCAL}ById: (id: string) => Promise<I${MODULE_NAME_PASCAL} | null>;
  
  // Acciones de mutación
  create${MODULE_NAME_PASCAL}: (${MODULE_NAME}: I${MODULE_NAME_PASCAL}Create) => Promise<void>;
  update${MODULE_NAME_PASCAL}: (id: string, ${MODULE_NAME}: I${MODULE_NAME_PASCAL}Update) => Promise<void>;
  delete${MODULE_NAME_PASCAL}: (id: string) => Promise<void>;
  activate${MODULE_NAME_PASCAL}: (id: string) => Promise<void>;
  deactivate${MODULE_NAME_PASCAL}: (id: string) => Promise<void>;
  
  // Acciones de UI
  setSelected${MODULE_NAME_PASCAL}: (${MODULE_NAME}: I${MODULE_NAME_PASCAL} | null) => void;
  clearMessages: () => void;
}

/**
 * Tipo completo del store de ${MODULE_NAME}
 */
export type ${MODULE_NAME_PASCAL}sStore = ${MODULE_NAME_PASCAL}sState & ${MODULE_NAME_PASCAL}sActions;
EOL

# Create store
cat > "$BASE_DIR/(presentation)/store/${MODULE_NAME}s.store.ts" << EOL
'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ${MODULE_NAME_PASCAL}sStore } from './${MODULE_NAME}s.types';
import { ApiRestDataSource, ${MODULE_NAME_PASCAL}RepositoryImpl } from '../../infrastructure';
import { I${MODULE_NAME_PASCAL} } from '../../domain';

// Inicializar el repositorio con la fuente de datos
const apiRestDataSource = new ApiRestDataSource();
const ${MODULE_NAME}sRepository = new ${MODULE_NAME_PASCAL}RepositoryImpl(apiRestDataSource);

/**
 * Store de ${MODULE_NAME}
 * Gestiona el estado global de los ${MODULE_NAME}s y proporciona acciones para interactuar con el repositorio
 */
export const use${MODULE_NAME_PASCAL}sStore = create<${MODULE_NAME_PASCAL}sStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        ${MODULE_NAME}s: [],
        selected${MODULE_NAME_PASCAL}: null,
        total: 0,
        page: 0,
        limit: 50,
        isLoading: false,
        errorMessage: null,
        successMessage: null,

        get${MODULE_NAME_PASCAL}s: async (page = 0, limit = 50) => {
          try {
            set({ isLoading: true, errorMessage: null });

            const response = await ${MODULE_NAME}sRepository.get${MODULE_NAME_PASCAL}s(page, limit);

            set({
              ${MODULE_NAME}s: response.${MODULE_NAME}s,
              total: response.total,
              page: response.page,
              limit: response.limit,
              isLoading: false,
            });
          } catch (error) {
            console.error('Error fetching ${MODULE_NAME}s:', error);
            set({
              isLoading: false,
              errorMessage: 'Error al cargar los ${MODULE_NAME}s. Por favor, inténtelo de nuevo.',
            });
          }
        },

        get${MODULE_NAME_PASCAL}ById: async (id: string) => {
          try {
            set({ isLoading: true, errorMessage: null });

            const ${MODULE_NAME} = await ${MODULE_NAME}sRepository.get${MODULE_NAME_PASCAL}ById(id);
            set({ isLoading: false });

            return ${MODULE_NAME};
          } catch (error) {
            console.error(\`Error fetching ${MODULE_NAME} with id \${id}:\`, error);
            set({
              isLoading: false,
              errorMessage: \`Error al cargar el ${MODULE_NAME} con ID \${id}. Por favor, inténtelo de nuevo.\`,
            });
            return null;
          }
        },

        create${MODULE_NAME_PASCAL}: async (${MODULE_NAME}: I${MODULE_NAME_PASCAL}Create) => {
          try {
            set({ isLoading: true, errorMessage: null, successMessage: null });

            await ${MODULE_NAME}sRepository.create${MODULE_NAME_PASCAL}(${MODULE_NAME});

            set({
              isLoading: false,
              successMessage: '${MODULE_NAME_PASCAL} creado correctamente.',
            });

            // Recargar la lista
            await get().get${MODULE_NAME_PASCAL}s(get().page, get().limit);
          } catch (error) {
            console.error('Error creating ${MODULE_NAME}:', error);
            set({
              isLoading: false,
              errorMessage: 'Error al crear el ${MODULE_NAME}. Por favor, inténtelo de nuevo.',
            });
          }
        },

        update${MODULE_NAME_PASCAL}: async (id: string, ${MODULE_NAME}: I${MODULE_NAME_PASCAL}Update) => {
          try {
            set({ isLoading: true, errorMessage: null, successMessage: null });

            await ${MODULE_NAME}sRepository.update${MODULE_NAME_PASCAL}(id, ${MODULE_NAME});

            set({
              isLoading: false,
              successMessage: '${MODULE_NAME_PASCAL} actualizado correctamente.',
            });

            // Recargar la lista
            await get().get${MODULE_NAME_PASCAL}s(get().page, get().limit);
          } catch (error) {
            console.error(\`Error updating ${MODULE_NAME} with id \${id}:\`, error);
            set({
              isLoading: false,
              errorMessage: 'Error al actualizar el ${MODULE_NAME}. Por favor, inténtelo de nuevo.',
            });
          }
        },

        delete${MODULE_NAME_PASCAL}: async (id: string) => {
          try {
            set({ isLoading: true, errorMessage: null, successMessage: null });

            await ${MODULE_NAME}sRepository.delete${MODULE_NAME_PASCAL}(id);

            set({
              isLoading: false,
              successMessage: '${MODULE_NAME_PASCAL} eliminado correctamente.',
            });

            // Recargar la lista
            await get().get${MODULE_NAME_PASCAL}s(get().page, get().limit);
          } catch (error) {
            console.error(\`Error deleting ${MODULE_NAME} with id \${id}:\`, error);
            set({
              isLoading: false,
              errorMessage: 'Error al eliminar el ${MODULE_NAME}. Por favor, inténtelo de nuevo.',
            });
          }
        },

        activate${MODULE_NAME_PASCAL}: async (id: string) => {
          try {
            set({ isLoading: true, errorMessage: null, successMessage: null });

            await ${MODULE_NAME}sRepository.activate${MODULE_NAME_PASCAL}(id);

            set({
              isLoading: false,
              successMessage: '${MODULE_NAME_PASCAL} activado correctamente.',
            });

            // Recargar la lista
            await get().get${MODULE_NAME_PASCAL}s(get().page, get().limit);
          } catch (error) {
            console.error(\`Error activating ${MODULE_NAME} with id \${id}:\`, error);
            set({
              isLoading: false,
              errorMessage: 'Error al activar el ${MODULE_NAME}. Por favor, inténtelo de nuevo.',
            });
          }
        },

        deactivate${MODULE_NAME_PASCAL}: async (id: string) => {
          try {
            set({ isLoading: true, errorMessage: null, successMessage: null });

            await ${MODULE_NAME}sRepository.deactivate${MODULE_NAME_PASCAL}(id);

            set({
              isLoading: false,
              successMessage: '${MODULE_NAME_PASCAL} desactivado correctamente.',
            });

            // Recargar la lista
            await get().get${MODULE_NAME_PASCAL}s(get().page, get().limit);
          } catch (error) {
            console.error(\`Error deactivating ${MODULE_NAME} with id \${id}:\`, error);
            set({
              isLoading: false,
              errorMessage: 'Error al desactivar el ${MODULE_NAME}. Por favor, inténtelo de nuevo.',
            });
          }
        },

        setSelected${MODULE_NAME_PASCAL}: (${MODULE_NAME}: I${MODULE_NAME_PASCAL} | null) => {
          set({ selected${MODULE_NAME_PASCAL}: ${MODULE_NAME} });
        },

        clearMessages: () => {
          set({ errorMessage: null, successMessage: null });
        },
      }),
      {
        name: '${MODULE_NAME}-store',
        partialize: (state) => ({
          page: state.page,
          limit: state.limit,
        }),
      }
    )
  )
);
EOL

# Create index file for store
cat > "$BASE_DIR/(presentation)/store/index.ts" << EOL
export * from './${MODULE_NAME}s.store';
export * from './${MODULE_NAME}s.types';
EOL

# Create components

# Create table component
cat > "$BASE_DIR/(presentation)/components/${MODULE_NAME}s-table.tsx" << EOL
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { I${MODULE_NAME_PASCAL} } from '../../domain';
import { use${MODULE_NAME_PASCAL}sStore } from '../store';
import { ${MODULE_NAME_PASCAL}DeleteDialog } from './${MODULE_NAME}-delete-dialog';
import { ${MODULE_NAME_PASCAL}FormSheet } from './${MODULE_NAME}-form-sheet';


interface ${MODULE_NAME_PASCAL}sTableProps {
  ${MODULE_NAME}s: I${MODULE_NAME_PASCAL}[];
}

export function ${MODULE_NAME_PASCAL}sTable({ ${MODULE_NAME}s }: ${MODULE_NAME_PASCAL}sTableProps) {
  const t = useTranslations('${MODULE_NAME_PASCAL}s');
  const [${MODULE_NAME}ToDelete, set${MODULE_NAME_PASCAL}ToDelete] = useState<I${MODULE_NAME_PASCAL} | null>(null);
  const [${MODULE_NAME}ToEdit, set${MODULE_NAME_PASCAL}ToEdit] = useState<I${MODULE_NAME_PASCAL} | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  const { delete${MODULE_NAME_PASCAL}, activate${MODULE_NAME_PASCAL}, deactivate${MODULE_NAME_PASCAL} } = use${MODULE_NAME_PASCAL}sStore();

  const handleDelete = async (id: string) => {
    try {
      await delete${MODULE_NAME_PASCAL}(id);
      setIsDeleteDialogOpen(false);
      set${MODULE_NAME_PASCAL}ToDelete(null);
    } catch (error) {
      console.error('Error deleting ${MODULE_NAME}:', error);
    }
  };

  const handleActivateDeactivate = async (id: string, isActive: boolean) => {
    try {
      if (isActive) {
        await deactivate${MODULE_NAME_PASCAL}(id);
      } else {
        await activate${MODULE_NAME_PASCAL}(id);
      }
    } catch (error) {
      console.error(\`Error changing ${MODULE_NAME} status with id \${id}:\`, error);
    }
  };

  const handleOpenDeleteDialog = (${MODULE_NAME}: I${MODULE_NAME_PASCAL}) => {
    set${MODULE_NAME_PASCAL}ToDelete(${MODULE_NAME});
    setIsDeleteDialogOpen(true);
  };

  const handleOpenEditSheet = (${MODULE_NAME}: I${MODULE_NAME_PASCAL}) => {
    set${MODULE_NAME_PASCAL}ToEdit(${MODULE_NAME});
    setIsEditSheetOpen(true);
  };

  const handleCloseEditSheet = () => {
    setIsEditSheetOpen(false);
    set${MODULE_NAME_PASCAL}ToEdit(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    set${MODULE_NAME_PASCAL}ToDelete(null);
  };

  return (
    <>
      <Table>
        <TableCaption>{t('table.caption')}</TableCaption>
        <TableHead>
          <TableRow>
            <TableHead>{t('table.name')}</TableHead>
            <TableHead>{t('table.description')}</TableHead>
            <TableHead>{t('table.status')}</TableHead>
            <TableHead>{t('table.created_at')}</TableHead>
            <TableHead>{t('table.actions')}</TableHead>
          </TableRow>
        </TableHead>
        <TableBody>
          {${MODULE_NAME}s.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                {t('table.no_data')}
              </TableCell>
            </TableRow>
          ) : (
            ${MODULE_NAME}s.map((${MODULE_NAME}) => (
              <TableRow key={${MODULE_NAME}.id}>
                <TableCell>{${MODULE_NAME}.name}</TableCell>
                <TableCell>{${MODULE_NAME}.description}</TableCell>
                <TableCell>
                  <span
                    className={\`px-2 py-1 rounded-full text-xs font-medium \${${MODULE_NAME}.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}\`}
                  >
                    {${MODULE_NAME}.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(${MODULE_NAME}.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenEditSheet(${MODULE_NAME})}
                      title={t('actions.edit')}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenDeleteDialog(${MODULE_NAME})}
                      title={t('actions.delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {${MODULE_NAME}.status === 'active' ? (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleActivateDeactivate(${MODULE_NAME}.id, true)}
                        title={t('actions.deactivate')}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleActivateDeactivate(${MODULE_NAME}.id, false)}
                        title={t('actions.activate')}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Delete Dialog */}
      <${MODULE_NAME_PASCAL}DeleteDialog
        ${MODULE_NAME}={${MODULE_NAME}ToDelete}
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={() => ${MODULE_NAME}ToDelete && handleDelete(${MODULE_NAME}ToDelete.id)}
      />

      {/* Edit Sheet */}
      <${MODULE_NAME_PASCAL}FormSheet
        ${MODULE_NAME}={${MODULE_NAME}ToEdit}
        isOpen={isEditSheetOpen}
        onClose={handleCloseEditSheet}
      />
    </>
  );
}
EOL

# Create delete dialog component
cat > "$BASE_DIR/(presentation)/components/${MODULE_NAME}-delete-dialog.tsx" << EOL
'use client';

import { useTranslations } from 'next-intl';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { I${MODULE_NAME_PASCAL} } from '../../domain';

interface ${MODULE_NAME_PASCAL}DeleteDialogProps {
  ${MODULE_NAME}: I${MODULE_NAME_PASCAL} | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ${MODULE_NAME_PASCAL}DeleteDialog({ ${MODULE_NAME}, isOpen, onClose, onConfirm }: ${MODULE_NAME_PASCAL}DeleteDialogProps) {
  const t = useTranslations('${MODULE_NAME_PASCAL}s');

  if (!${MODULE_NAME}) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('delete_dialog.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('delete_dialog.description', { name: ${MODULE_NAME}.name })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('delete_dialog.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{t('delete_dialog.confirm')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
EOL

# Create form sheet component
cat > "$BASE_DIR/(presentation)/components/${MODULE_NAME}-form-sheet.tsx" << EOL
'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Sheet, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ${MODULE_NAME}FormSchema, ${MODULE_NAME_PASCAL}FormValues } from '../../domain/validations/${MODULE_NAME}-schema';
import { I${MODULE_NAME_PASCAL}, E${MODULE_NAME_PASCAL}Status } from '../../domain';
import { use${MODULE_NAME_PASCAL}sStore } from '../store';
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ${MODULE_NAME_PASCAL}FormSheetProps {
  ${MODULE_NAME}: I${MODULE_NAME_PASCAL} | null;
  isOpen: boolean;
  onClose: () => void;
}

// Componente personalizado de SheetContent para pantalla completa
const SheetContent = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content>) => {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <SheetPrimitive.Content
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-background shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
          "w-full h-full max-w-full border-none",
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute right-6 top-6 rounded-sm opacity-80 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none bg-muted p-2 hover:bg-muted/80">
          <XIcon className="h-6 w-6" />
          <span className="sr-only">Cerrar</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
};

export function ${MODULE_NAME_PASCAL}FormSheet({ ${MODULE_NAME}, isOpen, onClose }: ${MODULE_NAME_PASCAL}FormSheetProps) {
  const t = useTranslations('${MODULE_NAME_PASCAL}s');
  const { create${MODULE_NAME_PASCAL}, update${MODULE_NAME_PASCAL} } = use${MODULE_NAME_PASCAL}sStore();
  const isEditing = !!${MODULE_NAME};

  const validationSchema = ${MODULE_NAME}FormSchema({
    name: {
      required: t('validation.name_required'),
    },
    description: {
      required: t('validation.description_required'),
    },
    status: {
      required: t('validation.status_required'),
    },
  });

  const form = useForm<${MODULE_NAME_PASCAL}FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: '',
      description: '',
      status: E${MODULE_NAME_PASCAL}Status.ACTIVE,
    },
  });

  // Cargar datos del ${MODULE_NAME} si estamos editando
  useEffect(() => {
    if (${MODULE_NAME} && isEditing) {
      form.reset({
        name: ${MODULE_NAME}.name,
        description: ${MODULE_NAME}.description,
        status: ${MODULE_NAME}.status,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        status: E${MODULE_NAME_PASCAL}Status.ACTIVE,
      });
    }
  }, [${MODULE_NAME}, isEditing, form]);

  const onSubmit = async (data: ${MODULE_NAME_PASCAL}FormValues) => {
    try {
      if (isEditing && ${MODULE_NAME}) {
        await update${MODULE_NAME_PASCAL}(${MODULE_NAME}.id, data);
      } else {
        await create${MODULE_NAME_PASCAL}(data);
      }
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <div className="h-full w-full p-6 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{isEditing ? t('form.edit_title') : t('form.create_title')}</SheetTitle>
            <SheetDescription>{t('form.description')}</SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.name_label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('form.name_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.description_label')}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t('form.description_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.status_label')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('form.status_placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={E${MODULE_NAME_PASCAL}Status.ACTIVE}>{t('status.active')}</SelectItem>
                        <SelectItem value={E${MODULE_NAME_PASCAL}Status.INACTIVE}>{t('status.inactive')}</SelectItem>
                        <SelectItem value={E${MODULE_NAME_PASCAL}Status.PENDING}>{t('status.pending')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SheetFooter className="pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  {t('form.cancel')}
                </Button>
                <Button type="submit">{isEditing ? t('form.update') : t('form.create')}</Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
EOL

# Create index file for components
cat > "$BASE_DIR/(presentation)/components/index.ts" << EOL
export * from './${MODULE_NAME}s-table';
export * from './${MODULE_NAME}-delete-dialog';
export * from './${MODULE_NAME}-form-sheet';
EOL

# Create main page
cat > "$BASE_DIR/(presentation)/page.tsx" << EOL
'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { use${MODULE_NAME_PASCAL}sStore } from './store';
import { ${MODULE_NAME_PASCAL}sTable } from './components/${MODULE_NAME}s-table';
import { ${MODULE_NAME_PASCAL}FormSheet } from './components/${MODULE_NAME}-form-sheet';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function ${MODULE_NAME_PASCAL}sPage() {
  const t = useTranslations('${MODULE_NAME_PASCAL}s');

  // Estado local para el formulario
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Obtener estado y acciones del store
  const { ${MODULE_NAME}s, total, page, limit, isLoading, get${MODULE_NAME_PASCAL}s } = use${MODULE_NAME_PASCAL}sStore();

  // Cargar ${MODULE_NAME}s al montar el componente
  useEffect(() => {
    get${MODULE_NAME_PASCAL}s(page, limit);
  }, [page, limit]);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(total / limit);

  // Cambiar de página
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      get${MODULE_NAME_PASCAL}s(newPage, limit);
    }
  };

  // Generar array de páginas a mostrar (máximo 5)
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages = [];
    
    if (totalPages <= maxPagesToShow) {
      // Si hay menos páginas que el máximo, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Estrategia para mostrar páginas actuales y cercanas
      let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  // Abrir formulario para crear ${MODULE_NAME}
  const handleOpenCreateForm = () => {
    setIsFormOpen(true);
  };

  // Cerrar formulario
  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <Button onClick={handleOpenCreateForm}>
          <Plus className="mr-2 h-4 w-4" /> {t('actions.create')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('table.title')}</CardTitle>
          <CardDescription>{t('table.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>{t('loading')}</p>
            </div>
          ) : (
            <>
              <${MODULE_NAME_PASCAL}sTable ${MODULE_NAME}s={${MODULE_NAME}s} />

              {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page <= 1}
                        />
                      </PaginationItem>

                      {getPageNumbers().map((pageNum) => (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNum)}
                            isActive={pageNum === page}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page >= totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <${MODULE_NAME_PASCAL}FormSheet
        ${MODULE_NAME}={null}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
      />
    </div>
  );
}
EOL

# Make the script executable
chmod +x create_nextjs_module.sh

echo "Module $MODULE_NAME_PASCAL has been created successfully!"
echo "📁 Location: $BASE_DIR"
echo "✅ Module creation complete!"