import { Body, Controller, HttpCode, HttpStatus, Get, UseGuards, Post, Query, Param, ParseIntPipe, NotFoundException, Patch, Delete} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam} from '@nestjs/swagger';
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
import { UserSuccessResponse } from 'src/common/dto/succes-response.dto';
import { GetMeResponseDataDto } from './dto/get-me-response.dto';
import { UpdateMeDto } from './dto/update-user-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangePasswordResponseDto } from './dto/change-password-response.dto';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
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

    @Get('me')
    @ApiOperation({ 
        summary: 'Get current aunthenticated user',
        description: 'Retrieve account data who currently login with profile detail'
    })
    @ApiResponse({
        status: 200,
        description: 'Success',
        type: GetMeResponseDataDto
    })
    async getMe(@CurrentUser() user: ActiveUserData) {
        return this.userService.getMe(user.id)
    }

    @Patch('me')
    @Roles(Role.OWNER)
    async updateMe(@CurrentUser() user: ActiveUserData, @Body() updateMeDto : UpdateMeDto) {
        return this.userService.updateMe(user.id, updateMeDto)
    }

    @Patch('me/password')
    @Roles(Role.OWNER)
    @ApiOperation({
        summary: 'Change password user',
        description: 'Change password user who currently login. Need bearer token in Authorization header'
    })
    @ApiResponse({
        status: 200,
        description: 'Password succesfuly changed',
        type: ChangePasswordResponseDto
    })
    async changePassword (@CurrentUser() user: ActiveUserData, @Body() changePasswordDto :  ChangePasswordDto) : Promise <ChangePasswordResponseDto> {
        const userId = user.id;
        return this.userService.changePassword(userId, changePasswordDto)          
    }

    @Get()
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

    @Get(':id')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @ApiOperation({
        summary: 'Get user by ID',
        description: 'Retrieve a specific user by their ID. Only accessible by Super Admin and Admin'
    })
    @ApiParam({
        name: 'id',
        description: 'User ID',
        type: 'number',
        example: 1
    })
    @ApiResponse({
        status: 200,
        description: 'User successfully retrieved',
        type: UserSuccessResponse
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Token missing or invalid'
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - User does not have access'
    })
    @ApiResponse({
        status: 404,
        description: 'Not Found - User not found'
    })
    async findOneById(@Param('id', ParseIntPipe) id: number) {
        const result = await this.userService.findOneById(id)
        if (!result) {
            throw new NotFoundException('User tidak ditemukan')
        }

        return result;
    }

    @Patch(':id/password')
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Update user password by Admin / SuperAdmin',
        description: 'Password user update by ID, only Admin and Super Admin can access '
    })
    @ApiResponse({
        status: 200,
        description: 'Password updated successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Old password does not match or invalid input',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Token missing or invalid',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - Only Admin/SuperAdmin allowed',
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
    })
    async updatePassword(@Param ('id', ParseIntPipe) id: number, @Body() changePasswordDto: ChangePasswordDto) {
        return this.userService.changePassword(id, changePasswordDto)
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Soft Delete User',
        description: 'Soft Delete user Account, Only accessible for Admin and Super Admin',
    })
    @ApiResponse({
        status: 200,
        description: 'User deleted successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Token missing or invalid',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - Only Admin/SuperAdmin allowed',
    })
    @ApiResponse({
        status: 404,
        description: 'User not found or already deleted',
    })
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.userService.softDeleteUser(id)
    }
}
