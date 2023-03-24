import { Tokens } from './tokens.type';

export type LoginResponse = {
  user: {
    username: string;
  };
  tokens: Tokens;
};
