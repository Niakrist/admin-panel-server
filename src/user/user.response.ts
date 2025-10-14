import { User } from 'generated/prisma';

export class UserResponse {
  items: User[];
  isHasMore: boolean;
}
