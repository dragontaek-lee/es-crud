import { Module } from '@nestjs/common';
import { EsController } from './es.controller';
import { EsService } from './es.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ElasticsearchModule} from "@nestjs/elasticsearch";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_NODE'),
        headers: {
          Authorization: `ApiKey ${configService.get('ELASTICSEARCH_API_KEY')}`,
        }
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [EsController],
  providers: [EsService],
})
export class AppModule {}
