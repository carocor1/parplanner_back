import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID:
        '401772327898-1t35h68a6mrlvhg4dtbp0tsp8t3r1poj.apps.googleusercontent.com', //variable de entorno a configurar
      clientSecret: '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', //variable de entorno a configurar
      callbackURL: 'http://localhost:3000/parplanner/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, id } = profile;
    const user = {
      email: emails[0].value,
      givenName: name.givenName,
      familyName: name.familyName,
      sub: id,
    };
    done(null, user);
  }
}
