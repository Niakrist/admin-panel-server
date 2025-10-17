import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { PaginationArgsWithSearchTerm } from 'src/base/pagination/pagination.args';
import type { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // @Auth('ADMIN')
  @Get()
  async getList(@Query() params: PaginationArgsWithSearchTerm) {
    return this.userService.findAll(params);
  }

  @Auth('ADMIN')
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.userService.findById(+id);
  }

  @Auth('ADMIN')
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Auth('ADMIN')
  @Put(':id')
  async updateUser(@Body() dto: UpdateUserDto, @Param('id') id: string) {
    return this.userService.update(+id, dto);
  }

  @Auth('ADMIN')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(+id);
  }
}
