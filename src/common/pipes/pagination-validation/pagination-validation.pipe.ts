import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PaginationDto } from '../../pagination/pagination.dto';

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

@Injectable()
export class PaginationValidationPipe<
  T extends PaginationDto,
> implements PipeTransform<T> {
  transform(value: T) {
    const { limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET }: PaginationDto =
      value;

    const parsedLimit = Number(limit);
    const parsedOffset = Number(offset);

    if (isNaN(parsedLimit) || isNaN(parsedOffset))
      throw new BadRequestException('Invalid values');

    if (parsedLimit > MAX_LIMIT || parsedLimit < 1 || parsedOffset < 0)
      throw new BadRequestException('Invalid values');

    return { ...value, limit: parsedLimit, offset: parsedOffset };
  }
}
