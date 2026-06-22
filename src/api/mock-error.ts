import { HttpException } from '@nestjs/common';
import { randomUUID } from 'crypto';

/**
 * Proofpoint-style reasons for the error responses documented for the
 * Email Submission `send` endpoint.
 * See: https://api-docs.ser.proofpoint.com/docs/email-submission/operations/send
 */
const REASONS: Record<number, string> = {
  400: 'bad request',
  401: 'unauthorized',
  403: 'forbidden',
  413: 'request entity too large',
  429: 'too many requests',
  500: 'internal server error',
};

/**
 * Parses a `mockStatus` query value into a usable HTTP error status code.
 * Returns `undefined` when no simulation was requested.
 * Throws an HttpException(400) when the value is present but not a valid
 * error status code (>= 400 and <= 599).
 */
export function parseMockStatus(value?: string): number | undefined {
  if (value === undefined || value === '') {
    return undefined;
  }

  const status = Number(value);
  if (!Number.isInteger(status) || status < 400 || status > 599) {
    throw new HttpException(
      {
        reason: `invalid mockStatus '${value}'; expected an HTTP error code between 400 and 599`,
        request_id: randomUUID(),
      },
      400,
    );
  }

  return status;
}

/**
 * Builds and throws a Proofpoint-style error response for the given status.
 */
export function throwMockError(status: number): never {
  throw new HttpException(
    {
      reason: REASONS[status] ?? 'error',
      request_id: randomUUID(),
    },
    status,
  );
}
