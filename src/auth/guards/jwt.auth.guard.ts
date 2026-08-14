import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Method optional untuk custom respon error jika token salah / tidak ada
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException({
        status: 401,
        message: 'Access denied. Token not found or expired.',
        data: null,
      });
    }
    return user;
  }
}