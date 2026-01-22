import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { roles: { include: { role: true } } },
    });
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return null;
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException("Credenciais inválidas");

    const roles = user.roles.map((item) => item.role.name);
    const payload = { sub: user.id, email: user.email, roles };
    const accessToken = await this.jwt.signAsync(payload, { expiresIn: "15m" });
    const refreshToken = await this.jwt.signAsync(payload, { expiresIn: "7d" });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return { accessToken, refreshToken };
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException("Refresh token inválido");
    }

    const roles = user.roles.map((item) => item.role.name);
    const payload = { sub: user.id, email: user.email, roles };
    const accessToken = await this.jwt.signAsync(payload, { expiresIn: "15m" });
    const newRefresh = await this.jwt.signAsync(payload, { expiresIn: "7d" });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefresh },
    });

    return { accessToken, refreshToken: newRefresh };
  }
}
