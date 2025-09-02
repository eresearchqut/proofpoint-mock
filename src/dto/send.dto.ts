export class Attachment {
  content: string;
  disposition: string;
  type: string;
  filename?: string;
  id?: string;
}

export class Content {
  body: string;
  type: 'text/html' | 'text/plain';
}

export class Recipient {
  email: string;
  name?: string;
}

export class Headers {
  from: Recipient;
}

export class ProofpointSendRequest {
  messageId?: string;
  attachments?: Array<Attachment>;
  content: Array<Content>;
  from: Recipient;
  headers: Headers;
  subject: string;
  replyTos: Array<Recipient>;
  tos: Array<Recipient>;
  cc?: Array<Recipient>;
  bcc?: Array<Recipient>;
}
