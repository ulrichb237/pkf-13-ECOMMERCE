/* tslint:disable */
import { AdresseDto } from './adresse-dto';
export interface EntrepriseDto {
  id?: number;
  nom?: string;
  description?: string;
  adresse?: AdresseDto;
  codeFiscal?: string;
  photo?: string;
  email?: string;
  numTel?: string;
  steWeb?: string;
  /** Transitoire : mot de passe choisi par l'utilisateur pour le compte admin a l'inscription */
  motDePasseAdmin?: string;
}
