import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { User } from 'generated/prisma/client';


@Injectable()
export class UsersService {
    constructor (
        private readonly prismaService : PrismaService
    ){}

    // find user by email
    async findOne(email: string): Promise<User | null> {
        return this.prismaService.user.findUnique({
            where : { email }
        })
    }

}
