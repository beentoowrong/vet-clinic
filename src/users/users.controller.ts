import { Body, Controller, HttpCode, HttpStatus, Get, UseGuards, Post, Query} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import type { ActiveUserData } from 'src/auth/interface/active-user-data.interface';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedUsersResponseDto } from './dto/paginated-response.dto';

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
    @ApiResponse({
        status: 201,
        description: 'User created successfuly'
    })
    async createUser(@Body() createUserDto : CreateUserDto, @CurrentUser() user: ActiveUserData) {
        return this.userService.createUser(createUserDto, user) 

    }

    @Get()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @ApiOperation({
        summary: 'Get all users with pagination',
        description: 'Retrieve all user list with pagination and role filter'
    })
    @ApiResponse({
        status: 200,
        description: 'Success',
        type: PaginatedUsersResponseDto
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request - Invalid query parametes'
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Token missing or invalid'
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - User does not have access'
    })
    async findAllPagination(@Query() paginationDto: PaginationDto) {
        return this.userService.findAllPaginated(paginationDto)
    }
}
