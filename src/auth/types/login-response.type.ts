import { Tokens } from './tokens.type';
import { User } from 'src/user/entities/user.entity'

export type LoginResponse = {
  user: User;
  tokens: Tokens;
};
