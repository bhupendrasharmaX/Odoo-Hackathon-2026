export interface ISmsProvider {
  sendOtp(mobileNumber: string, otp: string): Promise<boolean>;
}

export interface IMailService {
  sendMail(to: string, subject: string, html: string): Promise<boolean>;
}
