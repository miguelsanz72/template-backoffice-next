/**
 * DTO for change password request
 */
export class ChangePasswordDto {
  email: string = '';
  code: string = '';
  password: string = '';
}
