import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService} from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './straregies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './straregies/jwt.strategy';
import { GoogleStrategy } from './straregies/google.strategy'
@Module({
  imports: [UserModule, PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'), // Use ConfigService to get the secret
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy , GoogleStrategy],
})
export class AuthModule {}
