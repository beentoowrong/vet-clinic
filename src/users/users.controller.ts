import { Body, Controller, HttpCode, HttpStatus, Request, UseGuards, Post} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import type { ActiveUserData } from 'src/auth/interface/active-user-data.interface';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {    
    constructor(
        private readonly userService : UsersService
     ) {}

    @Post()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Created new user (DOCTOR, OWNER, ADMIN)' })
    async createUser(@Body() createUserDto : CreateUserDto, @CurrentUser() user: ActiveUserData) {
        return this.userService.CreateUser(createUserDto, user) 

    }
}
