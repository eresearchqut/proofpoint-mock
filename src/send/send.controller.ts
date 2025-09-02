import {Body, Controller, HttpCode, Post} from '@nestjs/common';
import {ProofpointSendRequest} from '../dto';
import {SendService} from './send.service';

@Controller()
export class SendController {
  constructor(private readonly sendService: SendService) {}

  @Post('send')
  @HttpCode(200)
  async send(@Body() body: ProofpointSendRequest) {
    return  this.sendService.send(body);
  }
}
