import { Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Producer } from 'kafkajs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaProducerProvider } from './kafka-producer.provider';

@Module({
  imports: [
    JwtModule.register({
      secret: 'fsdg435trf435reft34erfdh54tgrse56tgsree5e6tegrrs',
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, KafkaProducerProvider],
})
export class AppModule implements OnModuleDestroy {
  constructor(
    @Inject('KafkaProducer')
    private readonly kafkaProducer: Producer,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.kafkaProducer.disconnect();
  }
}
