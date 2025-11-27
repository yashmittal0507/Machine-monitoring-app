import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private readonly user = {
        email: 'admin@example.com',
        password: 'password123'
    };

    constructor(private jwtService: JwtService) { }

    async login(email: string, password: string) {
        if (email !== this.user.email || password !== this.user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { email };
        const token = this.jwtService.sign(payload);

        return { token };
    }
}



