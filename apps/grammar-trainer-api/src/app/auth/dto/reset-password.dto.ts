import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsStrongPasswordOptions,
} from 'class-validator';

const passwordOptions: IsStrongPasswordOptions = {
  minLength: 8,
  minLowercase: 1,
  minNumbers: 1,
  minSymbols: 1,
  minUppercase: 1,
};

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(passwordOptions)
  newPassword: string;
}
