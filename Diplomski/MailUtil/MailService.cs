using MailKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using Diplomski.Models;
using Microsoft.Extensions.Options;
using MimeKit;
using Org.BouncyCastle.Asn1.Pkcs;
using System;
using System.Linq;
using System.Net.Mail;
using System.Runtime;
using System.Threading;
using System.Threading.Tasks;

namespace Diplomski.MailUtil
{
    public class MailService : IMailService
    {
        private readonly MailSettings _settings;
        public MailService(IOptions<MailSettings> mailSettingsOptions)
        {
            _settings = mailSettingsOptions.Value;
        }

        public void SendActivationMail(Person person)
        {
            MailData mailData = new MailData();
            mailData.To.Add(person.Email);
            //mailData.EmailToName = person.Name + " " + person.Surname;
            mailData.Subject = "Activation Link";
            mailData.Body = "http://localhost:4200/ActivateProfile/" + person.ActivationLink;
            SendMail(mailData, new CancellationToken());


            //"replyTo": "test@mail.dk",
            //"replyToName": "Test mail",

        }

        public void SendConfirmationMail(Person person)
        {
            MailData mailData = new MailData();
            mailData.To.Add(person.Email);
            //mailData.EmailToName = person.Name + " " + person.Surname;
            mailData.Subject = "Confirmation";
            mailData.Body = "http://localhost:4200/map";
            SendMail(mailData, new CancellationToken());


            //"replyTo": "test@mail.dk",
            //"replyToName": "Test mail",

        }

        public async Task<bool> SendMail(MailData mailData, CancellationToken ct = default)
        {
            try
            {
                // Inicijalizacija MimeMessage objekta
                var mail = new MimeMessage();

                // Postavljanje detalja mejla
                mail.From.Add(new MailboxAddress(_settings.DisplayName, mailData.From ?? _settings.From));
                mail.Sender = new MailboxAddress(mailData.DisplayName ?? _settings.DisplayName, mailData.From ?? _settings.From);
                mail.To.AddRange(mailData.To.Select(address => MailboxAddress.Parse(address)));
                mail.Subject = mailData.Subject;

                // Postavljanje tela mejla
                var body = new BodyBuilder();
                body.HtmlBody = mailData.Body;
                mail.Body = body.ToMessageBody();

                // Slanje mejla preko SMTP klijenta
                using (var smtp = new MailKit.Net.Smtp.SmtpClient())
                {
                    if (_settings.UseSSL)
                    {
                        await smtp.ConnectAsync(_settings.Host, _settings.Port, SecureSocketOptions.SslOnConnect, ct);
                    }
                    else if (_settings.UseStartTls)
                    {
                        await smtp.ConnectAsync(_settings.Host, _settings.Port, SecureSocketOptions.StartTls, ct);
                    }
                    await smtp.AuthenticateAsync(_settings.UserName, _settings.Password, ct);
                    await smtp.SendAsync(mail, ct);
                    await smtp.DisconnectAsync(true, ct);
                }

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }



    }
}