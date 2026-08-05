import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

export interface JwtPayload {
    sub: number; // ID User
    email: string; // Email User
    role: string; // Role (DOCTOR, OWNER, ADMIN)
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService : ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            // getOrThrow menjamin return value pasti string
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET')
        });
    }

    async validate(payload : JwtPayload) {
        if (!payload) {
            throw new UnauthorizedException('Token tidak valid')
        }

        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
        }
    }
}