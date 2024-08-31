using Diplomski.Models;
using Org.BouncyCastle.Asn1.Pkcs;
using System.Threading.Tasks;
using System.Threading;

namespace Diplomski.MailUtil
{
    public interface IMailService
    {
        void SendActivationMail(Person person);
        Task<bool> SendMail(MailData mailData, CancellationToken ct = default);
        void SendConfirmationMail(Person person);
    }
}