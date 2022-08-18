import { Inject, Injectable } from '@nestjs/common';
import { Producer } from 'kafkajs';

@Injectable()
export class AppService {
  constructor(
    @Inject('KafkaProducer')
    private readonly kafkaProducer: Producer,
  ) {}

  async searchMaster(query:string,params:Object,body:any){
    body.generales['sql'] = query;
    body.generales['params'] = params;
    body.generales.operacion = 'search';

    this.sendMessage('nest_nododatos', body, 'nest_gateway');
  }

  async sendMessage(topic:string, data:Object, key?:string) {
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
