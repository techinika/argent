declare module "nodemailer" {
  export interface Transporter {
    sendMail(
      options: Mail.Options,
      callback?: (err: Error | null, info: SentMessageInfo) => void,
    ): Promise<SentMessageInfo>;
  }

  export interface SentMessageInfo {
    messageId: string;
    accepted: string[];
    rejected: string[];
  }

  export function createTransport(config: SMTPTransport | Options): Transporter;

  export interface SMTPTransport {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  }

  export interface Options {
    host?: string;
    port?: number;
    secure?: boolean;
    auth?: {
      user?: string;
      pass?: string;
    };
  }

  export namespace Mail {
    export interface Options {
      from?: string;
      to: string | string[];
      subject: string;
      html?: string;
      text?: string;
    }
  }
}
