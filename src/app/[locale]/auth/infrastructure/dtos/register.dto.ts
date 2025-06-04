/**
 * DTO for user registration request
 * Represents the data structure expected by the API
 */
export interface RegisterRequestDto {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}
