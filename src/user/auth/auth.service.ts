import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

interface SignupParams {
  email: string;
  name: string;
  phone: string;
  password: string;
}

interface SigninParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async signup({ email, name, phone, password }: SignupParams) {
    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });
    const hashPassword = await bcrypt.hash(password, 10);
    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        phone,
        password: hashPassword,
        userType: UserType.BUYER,
      },
    });

    const token = await this.generateToken(user);

    return { token };
  }

  async signIn({ email, password }: SigninParams) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new HttpException('User does not exist', 404);
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new HttpException('Invalid credentials', 401);
    }
    const token = await this.generateToken(user);

    return { token };
  }

  async generateToken(user) {
    const token = jwt.sign(
      { name: user.name, userId: user.id },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      },
    );
    return token;
  }
}
