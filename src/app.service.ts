import { Inject, Injectable } from '@nestjs/common';
import { Producer } from 'kafkajs';

@Injectable()
export class AppService {
  constructor(
    @Inject('KafkaProducer')
    private readonly kafkaProducer: Producer,
  ) {}

  async consultarMaster(query,params,body){
    body.generales['sql'] = query;
    body.generales['params'] = params;
    body.generales.operacion = 'consultar';

    this.sendMessage('nest_nododatos', body, 'nest_gateway');
  }

  async sendMessage(topic, data, key?) {
    return this.kafkaProducer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(data),
          key,
        },
      ],
    });
  }
}
