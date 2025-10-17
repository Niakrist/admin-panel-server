import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dto/create-user.dto';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { isHasMorePagination } from 'src/base/pagination/is-has-more';
import { PaginationArgsWithSearchTerm } from 'src/base/pagination/pagination.args';
import { UserResponse } from './user.response';
import { Prisma } from 'generated/prisma';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAll(args?: PaginationArgsWithSearchTerm): Promise<UserResponse> {
    const searchTermQuery = args?.searchTerm
      ? this.getSearchTermFilter(args.searchTerm)
      : {};

    const skip = args?.skip ? +args.skip : 0;
    const take = args?.take ? +args.take : 10;

    const users = await this.prisma.user.findMany({
      skip,
      take,
      where: searchTermQuery,
    });

    const totalCount = await this.prisma.user.count({ where: searchTermQuery });

    const isHasMore = isHasMorePagination(totalCount, skip, take);

    return { items: users, isHasMore };
  }

  async create({ password, ...dto }: AuthDto) {
    const user = { ...dto, password: await hash(password) };
    return this.prisma.user.create({ data: user });
  }

  async update(id: number, { password, ...data }: UpdateUserDto) {
    await this.findById(id);

    const hashedPassword = password ? { password: await hash(password) } : {};

    return this.prisma.user.update({
      where: { id },
      data: { ...data, ...hashedPassword },
    });
  }

  async delete(id: number) {
    await this.findById(id);
    return this.prisma.user.delete({ where: { id } });
  }

  private getSearchTermFilter(searchTerm: string): Prisma.UserWhereInput {
    return {
      OR: [
        {
          email: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          country: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
      ],
    };
  }
}
