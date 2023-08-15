export interface WelcomeEmail {
  email: string;
  subject: string;
  name: string;
  year: number;
}

export interface VerificationEmail {
  code: string;
  email: string;
  subject: string;
  year: number;
}
