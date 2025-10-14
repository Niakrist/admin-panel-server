import { AuthGuard } from '@nestjs/passport';

// Проверяет авторизирован пользователь или нет
export class JwtAuthGuard extends AuthGuard('jwt') {}
