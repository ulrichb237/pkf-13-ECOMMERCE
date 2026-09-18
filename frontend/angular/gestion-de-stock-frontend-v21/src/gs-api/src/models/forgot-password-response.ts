/* tslint:disable */
export interface ForgotPasswordResponse {
  message?: string;
  /** Present uniquement en l'absence de serveur SMTP cote backend */
  code?: string;
}
