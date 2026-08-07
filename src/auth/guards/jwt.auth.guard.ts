import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Method optional untuk custom respon error jika token salah / tidak ada
  handleRequest(err: any, user: any, info: any) {

    // TAMBAHKAN LOG INI UNTUK DEBUGGING:
    console.log('--- DEBUG GUARD ---');
    console.log('Error:', err);
    console.log('User:', user);
    console.log('Info:', info?.message); // Menjelaskan KENAPA token ditolak Passport


    if (err || !user) {
      throw err || new UnauthorizedException({
        status: 401,
        message: 'Akses ditolak, token tidak ditemukan atau kedaluwarsa',
        data: null,
      });
    }
    return user;
  }
}