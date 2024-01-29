import path from 'path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    createTypeOrmOptions():
        | TypeOrmModuleOptions
        | Promise<TypeOrmModuleOptions> {
        return this.configService.get('NODE_ENV') === 'test'
            ? {
                  type: 'postgres',
                  host: this.configService.get('DB_HOST'),
                  port: +this.configService.get('DB_PORT'),
                  username: this.configService.get('DB_USERNAME'),
                  password: this.configService.get('DB_PASSWORD'),
                  database: this.configService.get('DB_DATABASE'),
                  entities: [
                      path.join(__dirname, `../../../**/*.entity{.ts,.js}`),
                  ],
                  synchronize: true,
                  namingStrategy: new SnakeNamingStrategy(),
              }
            : {
                  type: 'postgres',
                  host: this.configService.get('DB_HOST'),
                  port: +this.configService.get('DB_PORT'),
                  username: this.configService.get('DB_USERNAME'),
                  password: this.configService.get('DB_PASSWORD'),
                  database: this.configService.get('DB_DATABASE'),
                  entities: [
                      path.join(__dirname, `../../../**/*.entity{.ts,.js}`),
                  ],
                  synchronize: false,
                  namingStrategy: new SnakeNamingStrategy(),
              };
    }
}
