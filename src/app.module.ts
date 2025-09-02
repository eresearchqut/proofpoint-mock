import { Module } from '@nestjs/common';
import { SendController } from './send/send.controller';
import { SendService } from './send/send.service';

@Module({
  imports: [],
  controllers: [SendController],
  providers: [SendService],
})
export class AppModule {}
