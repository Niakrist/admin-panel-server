import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}
  sendMail(to: string, subject: string, html: string) {
    return this.mailService.sendMail({
      to, // Клму отправляем
      subject, // Тема письма
      html, // Тело сообщения
    });
  }

  sendWelcome(to: string) {
    return this.sendMail(to, 'Спасибо за регистрацию', '<p>Спасибо!</p>');
  }
}
