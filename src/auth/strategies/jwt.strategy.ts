import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from "src/common/prisma/prisma.service";

export interface JwtPayload {
    sub: number; // ID User
    email: string; // Email User
    role: string; // Role (DOCTOR, OWNER, ADMIN)
    token: string; // Token JWT
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService : ConfigService,
        private prismaService : PrismaService
    ) {
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

        console.log('1. Payload terdekripsi', payload)

        // Cek apakah user ada dan kolom token di DB tidak null
        const user = await this.prismaService.user.findUnique({
            where: {
                id: payload.sub
            }
        })

        if(!user || !user.token) {
            throw new UnauthorizedException('Sesi telah berakhir, silahkan login kembali')
        }

        return user;
    }
}