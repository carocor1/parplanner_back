import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, contraseña: string): Promise<any> {
    console.log(email);
    console.log(contraseña);
    const user = await this.authService.validateUser(email, contraseña);
    if (!user) {
      console.log('no autorizado');
      throw new UnauthorizedException();
    }
    return user;
  }
}
