import { PrismaService } from './../../prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from '../utils/constants';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async signup(dto: AuthDto) {
    const { email, password } = dto;

    const foundUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (foundUser) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await this.hashPassword(password);
    await this.prisma.user.create({
      data: { email, hashedPassword },
    });
    return { message: 'User created successfully' };
  }

  async signin(dto: AuthDto, req: Request, res: Response) {
    const { email, password } = dto;
    const foundUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!foundUser) {
      throw new BadRequestException('Invalid credentials');
    }

    const isMatch = await this.comparePasswords({
      password,
      hash: foundUser.hashedPassword,
    });

    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    // sign jwt token
    const token = await this.signToken({
      id: foundUser.id,
      email: foundUser.email,
    });

    if (!token) {
      throw new ForbiddenException('Forbidden access');
    }

    // send token as cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
      sameSite: 'none',
    });

    return res.send({ message: 'User logged in successfully' });
  }

  async signout(req: Request, res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'User logged out successfully' });
  }

  // helper function for hashing password
  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  // helper function for comparing password
  async comparePasswords(args: { password: string; hash: string }) {
    return await bcrypt.compare(args.password, args.hash);
  }

  // helper function for signing jwt token
  async signToken(args: { id: string; email: string }) {
    const payload = args;
    return this.jwt.signAsync(payload, { secret: jwtSecret });
  }
}
