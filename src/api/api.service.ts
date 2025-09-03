import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ProofpointSendRequest, Recipient } from '../dto';
import { randomUUID } from 'crypto';

@Injectable()
export class ApiService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const host = process.env.SMTP_HOST || 'localhost';
    const port = process.env.SMTP_PORT
      ? parseInt(process.env.SMTP_PORT, 10)
      : 1025;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      ignoreTLS: true, // MailHog does not use TLS by default
    });
  }

  private mapToMailOptions(
    sendRequest: ProofpointSendRequest,
  ): nodemailer.SendMailOptions {
    const { from, tos, cc, bcc, subject, content, headers } = sendRequest;
    const mapRecipient = (recipient: Recipient) => ({
      name: recipient.name,
      address: recipient.email,
    });

    const html = content.filter(({ type }) => type === 'text/html').at(0)?.body;
    const text = content
      .filter(({ type }) => type === 'text/plain')
      .at(0)?.body;

    return {
      from: mapRecipient(from),
      to: tos.map((r) => mapRecipient(r)),
      cc: cc?.map((r) => mapRecipient(r)),
      bcc: bcc?.map((r) => mapRecipient(r)),
      subject,
      text,
      html,
      headers: { from: headers.from.email },
    };
  }

  async send(sendRequest: ProofpointSendRequest) {
    const mailOptions = this.mapToMailOptions(sendRequest);

    return this.transporter.sendMail(mailOptions).then((info) => {
      const request_id = randomUUID();
      const message_id = info?.messageId ?? randomUUID();

      return {
        message_id,
        reason: 'accepted',
        request_id,
      };
    });
  }
}
