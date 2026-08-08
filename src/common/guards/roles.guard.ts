import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../enum/role.enum";
import { ROLES_KEY } from "../decorator/roles.decorator";


@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector
    ) {}

    canActivate(context: ExecutionContext): boolean {
        // Pertama, Ambil daftar role yang diizinkan dari dekorator @Roles()
        // Contoh: [Role.DOCTOR, Role.ADMIN]
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Jika endpoint tidak diberi dekorator @Roles(), artinya bebas diakses siapapun 
        if (!requiredRoles) {
            return true
        }

        // Kedua, ambil data user dari request (diisi oleh JWTStrategy)
        const { user } = context.switchToHttp().getRequest();

        // Ketiga, cek apakah role user saat ini ada di dalam daftar requiredRoles
        // user.role nilainya misal adalah 'DOCTOR'
        // Fungsi requiredRoles.includes(user.role) itu seperti bertanya
        return requiredRoles.includes(user.role)
        // "fungsi requiredRoles.includes(user.role) 'Apakah kata 'DOCTOR' (user.role) ada di dalam daftar ['DOCTOR', 'ADMIN'] (requiredRoles)?'"
        // kalau 'Ada' -> return true, kalau 'Gak Ada' return false (NESTJS)
    }
}