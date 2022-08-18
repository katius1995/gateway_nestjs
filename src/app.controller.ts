import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Res,
  Headers,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { GlobalService } from './global/global.variables';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private jwtService: JwtService) {
    GlobalService.cont = 0;
    GlobalService.context = {};
  }

  @Post('/login')
  async postLogin(@Res() req) {
    if (req.req.body) {
      const body = req.req.body;
      const data = body.data;
      if (data.username && data.password) {
        if (body.generales) {
          if (body.generales.operacion == 'login') {
            GlobalService.cont++;
            body.data.contador = GlobalService.cont;
            GlobalService.context[GlobalService.cont] = req;

            this.appService.sendMessage('nest_usuarios', body, 'nest_gateway-login');
          } else {
            return req.status(HttpStatus.BAD_REQUEST).json({
              status: 502,
              message: 'Solo se acepta la operacion login.',
            });
          }
        } else
          return req
            .status(HttpStatus.BAD_REQUEST)
            .json({ status: 502, message: 'Se espera el json generales' });
      } else
        return req.status(HttpStatus.BAD_REQUEST).json({
          status: 502,
          message: 'Se debe enviar usaurio y contraseña.',
        });
    } else {
      return req.status(HttpStatus.BAD_REQUEST).json({ status: 'error' });
    }
  }

  @Get('/api/nestjs')
  async getProcessQuery(@Res() req, @Headers() headers) {
    try{
      let valid = this.jwtService.verify(headers.authorization.replace("Bearer ",""), {publicKey: "fsdg435trf435reft34erfdh54tgrse56tgsree5e6tegrrs"});
      console.log(valid);
      this.ProcessQuery(req);
    }catch(err){
      console.log("Error = "+err);
      return req.status(HttpStatus.UNAUTHORIZED).json({ status: ""+err });
    }
  }

  @Post('/api/nestjs')
  async postProcessQuery(@Res() req, @Headers() headers) {
    try{
      let valid = this.jwtService.verify(headers.authorization.replace("Bearer ",""), {publicKey: "fsdg435trf435reft34erfdh54tgrse56tgsree5e6tegrrs"});
      console.log(valid);
      this.ProcessQuery(req);
    }catch(err){
      console.log("Error = "+err);
      return req.status(HttpStatus.UNAUTHORIZED).json({ status: ""+err });
    }
  }

  @Put('/api/nestjs')
  async putProcessQuery(@Res() req, @Headers() headers) {
    try{
      let valid = this.jwtService.verify(headers.authorization.replace("Bearer ",""), {publicKey: "fsdg435trf435reft34erfdh54tgrse56tgsree5e6tegrrs"});
      console.log(valid);
      this.ProcessQuery(req);
    }catch(err){
      console.log("Error = "+err);
      return req.status(HttpStatus.UNAUTHORIZED).json({ status: ""+err });
    }
  }

  @Delete('/api/nestjs')
  async deleteProcessQuery(@Res() req, @Headers() headers) {
    try{
      let valid = this.jwtService.verify(headers.authorization.replace("Bearer ",""), {publicKey: "fsdg435trf435reft34erfdh54tgrse56tgsree5e6tegrrs"});
      console.log(valid);
      this.ProcessQuery(req);
    }catch(err){
      console.log("Error = "+err);
      return req.status(HttpStatus.UNAUTHORIZED).json({ status: ""+err });
    }
  }

  async ProcessQuery(req: any) {
    try {
      console.log(req.req.method);
      let body;
      if (req.req.method == 'GET') {
        body = JSON.parse(req.req.query.body);
      } else {
        body = req.req.body;
      }

      //const data = body.data;
      GlobalService.cont++;
      body.data.contador = GlobalService.cont;
      GlobalService.context[GlobalService.cont] = req;

      console.log('Body === ' + body);
      this.appService.sendMessage(
        'nest_' + body.generales.tipo_servicio,
        body,
        'nest_gateway',
      );
    } catch (error) {
      req
        .status(HttpStatus.BAD_REQUEST)
        .json({ status: 502, message: 'Error en body. Razon: ' + error });
    }
  }

  @MessagePattern('nest_gateway') // Our topic name
  getGateway(@Payload() message) {
    console.log('Gateway');
    const sub = message.contador;
    console.log('Message = ' + sub);
    const payload = { username: message.data.username };
    let access_token = this.jwtService.sign(payload);
    message["token"] = access_token;
    try {
      if (message.estado_p == 200)
        GlobalService.context[sub].status(HttpStatus.OK).json(message);
      else
        GlobalService.context[sub].status(HttpStatus.NOT_FOUND).json(message);
      //GlobalService.context.remove(sub);
    } catch (error) {
      console.log('ERROR = ' + error);
    }
  }

  @MessagePattern('nest_gateway-login') // Our topic name
  getLogin(@Payload() message) {
    console.log('Gateway login');
    const sub = message.contador;
    console.log('Message = ' + sub);

    // IMPLEMENTAR TOKEN
    const payload = { codigo: message.data[0].codigo, nombre: message.data[0].nombre };
    let access_token = this.jwtService.sign(payload);
    message["token"] = access_token;
    try {
      if (message.estado_p == 200)
        GlobalService.context[sub].status(HttpStatus.OK).json(message);
      else
        GlobalService.context[sub].status(HttpStatus.NOT_FOUND).json(message);
      //GlobalService.context.remove(sub);
    } catch (error) {
      console.log('ERROR = ' + error);
    }
  }
}
