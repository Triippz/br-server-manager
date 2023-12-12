import {
  Controller,
  Get,
  Render,
  Post,
  Redirect,
  Body,
  Req,
  Res,
  Put,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpsertUserDto } from './dtos/upsert-user.dto';
import { validate, ValidationError } from 'class-validator';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/register')
  @Render('auth/register')
  registerView() {
    const viewData = [];
    viewData['title'] = 'User Register - Online Store';
    viewData['subtitle'] = 'User Register';
    return {
      viewData: viewData,
    };
  }

  @Post('/register')
  async registerUser(
    @Body() body: UpsertUserDto,
    @Res() response: any,
    @Req() request: any,
  ) {
    const errors: ValidationError[] = await validate(body);

    if (errors.length > 0) {
      request.session.flashErrors = errors;
      return response.redirect('/auth/register');
    } else {
      await this.authService.create(body);
      return response.redirect('/auth/login');
    }
  }

  @Put('/update/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() body: UpsertUserDto,
    @Res() response: any,
    @Req() request: any,
  ) {
    const errors: ValidationError[] = await validate(body);

    if (errors.length > 0) {
      request.session.flashErrors = errors;
      return response.redirect('/account/update');
    } else {
      await this.authService.update(id, body);
      return response.redirect('/account');
    }
  }

  @Get('/login')
  @Render('auth/login')
  login() {
    const viewData = [];
    viewData['title'] = 'User Login - Online Store';
    viewData['subtitle'] = 'User Login';
    return {
      viewData: viewData,
    };
  }

  @Post('/connect')
  async connect(@Body() body, @Req() request, @Res() response) {
    const email = body.email;
    const pass = body.password;
    const user = await this.authService.login(email, pass);
    if (user) {
      request.session.user = {
        id: user.id,
        username: user.username,
        role: user.role,
      };
      return response.redirect('/');
    } else {
      return response.redirect('/auth/login');
    }
  }

  @Get('/logout')
  @Redirect('/')
  logout(@Req() request) {
    request.session.user = null;
  }
}
