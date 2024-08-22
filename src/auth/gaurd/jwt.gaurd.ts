import { AuthGuard } from '@nestjs/passport';

export class JWTGaurd extends AuthGuard('Userjwt') {
  constructor() {
    super();
  }
}
