import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { RegisterDTO } from '../../../auth/dto/register.dto';

@Injectable()
export class ConfirmPasswordPipe implements PipeTransform {
  transform(value: RegisterDTO, metadata: ArgumentMetadata) {
    if (value.password != value.confirmPassword) {
      throw new BadRequestException(
        'Password and Confirm Password do not match',
      );
    }

    return value;
  }
}
