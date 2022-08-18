import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const appServer = await NestFactory.create(AppModule);
  await appServer.listen(3000).then(() => {
    console.log('Server is listening in port 3000!');
  });

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'nestjs-gateway',
        },
      },
    },
  );

  app.listen().then(() => {
    console.log('Kafka consumer service is listening!');
  });
}
bootstrap();
