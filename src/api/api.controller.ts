import { Body, Controller, HttpCode, Post, Query } from '@nestjs/common';
import { ProofpointSendRequest } from '../dto';
import { ApiService } from './api.service';
import { parseMockStatus, throwMockError } from './mock-error';

const TOKEN_EXPIRY = 900;

@Controller()
export class ApiController {
  constructor(private readonly sendService: ApiService) {}

  @Post('token')
  @HttpCode(200)
  async token(
    @Body('client_id') clientId: string,
    @Body('client_secret') clientSecret: string,
    @Body('grant_type') grantType: string,
  ) {
    return {
      access_token: 'mock_token',
      token_type: 'bearer',
      expires_in: TOKEN_EXPIRY,
      token_expires_date_time: new Date(
        Date.now() + TOKEN_EXPIRY * 1000,
      ).toISOString(),
      _mock: {
        clientId,
        clientSecret,
        grantType,
      },
    };
  }

  @Post('send')
  @HttpCode(200)
  async send(
    @Body() body: ProofpointSendRequest,
    @Query('mockStatus') mockStatus?: string,
  ) {
    const status = parseMockStatus(mockStatus);
    if (status !== undefined) {
      throwMockError(status);
    }

    return this.sendService.send(body);
  }
}
