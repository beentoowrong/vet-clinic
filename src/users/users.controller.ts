import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {    

}
