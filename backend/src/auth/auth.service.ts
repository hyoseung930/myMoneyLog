import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const existingUser = await this.usersService.findByUsername(signupDto.username);
    
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    const user = await this.usersService.create({
      username: signupDto.username,
      nickname: signupDto.nickname,
      password: hashedPassword,
      encryptedMasterKeyByPassword: signupDto.encryptedMasterKeyByPassword,
      encryptedMasterKeyByRecovery: signupDto.encryptedMasterKeyByRecovery,
      passwordSalt: signupDto.passwordSalt,
      recoverySalt: signupDto.recoverySalt,
    });

    const accessToken = this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        encryptedMasterKey: user.encryptedMasterKeyByPassword,
        masterKeySalt: user.passwordSalt,
      },
      recoveryKey: signupDto.recoveryKey,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByUsername(loginDto.username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });

    console.log('[AUTH SERVICE] Generated token:', accessToken);
    console.log('[AUTH SERVICE] Token type:', typeof accessToken);
    console.log('[AUTH SERVICE] Token first char code:', accessToken.charCodeAt(0));

    const result = {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        encryptedMasterKey: user.encryptedMasterKeyByPassword,
        masterKeySalt: user.passwordSalt,
      },
    };

    console.log('[AUTH SERVICE] Returning result:', JSON.stringify(result));
    return result;
  }

  async validateUser(userId: string) {
    return this.usersService.findById(userId);
  }
}
