import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dto/create-user.dto';
import { AuthDto } from 'src/auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create({ password, ...dto }: AuthDto) {
    const user = { ...dto, password: await hash(password) };
    return await this.prisma.user.create({ data: user });
  }

  async update(id: number, { password, ...data }: UpdateUserDto) {
    await this.findById(id);

    const hashedPassword = password ? { password: await hash(password) } : {};

    return this.prisma.user.update({
      where: { id },
      data: { ...data, ...hashedPassword },
    });
  }
}
