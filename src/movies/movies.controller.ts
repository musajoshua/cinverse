import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FilterMovieDto } from './dto/filter-movie.dto';
import { USER_ROLES } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @USER_ROLES(UserRole.ADMIN)
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  findAll(@Query() filters: FilterMovieDto) {
    return this.moviesService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Patch(':id')
  @USER_ROLES(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @USER_ROLES(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}
