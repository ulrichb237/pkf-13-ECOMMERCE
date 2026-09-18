import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthenticationService} from '../../../gs-api/src/services/authentication.service';
import {AuthenticationRequest} from '../../../gs-api/src/models/authentication-request';
import {Observable, of} from 'rxjs';
import {AuthenticationResponse} from '../../../gs-api/src/models/authentication-response';
import {Router} from '@angular/router';
import {UtilisateursService} from '../../../gs-api/src/services/utilisateurs.service';
import {UtilisateurDto} from '../../../gs-api/src/models/utilisateur-dto';
import {retry} from 'rxjs/operators';
import {ChangerMotDePasseUtilisateurDto} from '../../../gs-api/src/models/changer-mot-de-passe-utilisateur-dto';
import {RefreshTokenRequest} from '../../../gs-api/src/models/refresh-token-request';
import {ForgotPasswordResponse} from '../../../gs-api/src/models/forgot-password-response';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private utilisateurService: UtilisateursService,
    private router: Router
  ) { }


  login(authenticationRequest: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.authenticationService.authenticate(authenticationRequest);
  }

  /** Echange le refresh token contre un nouveau couple access/refresh (rotation cote backend) */
  refreshSession(): Observable<AuthenticationResponse> {
    const request: RefreshTokenRequest = {
      refreshToken: this.getRefreshToken()
    };
    return this.authenticationService.refresh(request);
  }

  /** Revoque le refresh token cote backend puis purge le stockage local */
  logout(): void {
    const request: RefreshTokenRequest = {
      refreshToken: this.getRefreshToken()
    };
    this.authenticationService.deconnexion(request).subscribe({
      next: () => this.purgerSession(),
      error: () => this.purgerSession()
    });
  }

  purgeSession(): void {
    this.purgerSession();
  }

  private purgerSession(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('connectedUser');
    this.router.navigate(['login']);
  }

  getRefreshToken(): string | undefined {
    const stored = localStorage.getItem('accessToken');
    if (!stored) {
      return undefined;
    }
    try {
      return (JSON.parse(stored) as AuthenticationResponse).refreshToken;
    } catch {
      return undefined;
    }
  }

  /** POST /authentification/mot-de-passe-oublie : demande un code (renvoye dans la reponse, SMTP non configure) */
  forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    return this.authenticationService.forgotPassword({ email });
  }

  /** POST /authentification/reinitialisation : code + nouveau mot de passe */
  reinitialiserMotDePasse(code: string, nouveauMotDePasse: string): Observable<void> {
    return this.authenticationService.reinitialiserMotDePasse({ code, nouveauMotDePasse });
  }

  getUserByEmail(email?: string): Observable<UtilisateurDto> {
    if (email !== undefined) {
      return this.utilisateurService.findByEmail(email);
    }
    return of();
  }

  /** GET /api/v1/utilisateurs — liste des utilisateurs de l'entreprise */
  findAllUtilisateurs(): Observable<UtilisateurDto[]> {
    return this.utilisateurService.findAll();
  }

  /** POST /api/v1/utilisateurs — creation d'un utilisateur (admin) */
  saveUtilisateur(utilisateur: UtilisateurDto): Observable<UtilisateurDto> {
    return this.utilisateurService.save(utilisateur);
  }

  /** GET /api/v1/utilisateurs/{idUtilisateur} — fiche utilisateur */
  findUtilisateurById(idUtilisateur?: number): Observable<UtilisateurDto> {
    if (idUtilisateur) {
      return this.utilisateurService.findById(idUtilisateur);
    }
    return of({});
  }

  /** DELETE /api/v1/utilisateurs/{idUtilisateur} */
  deleteUtilisateur(idUtilisateur?: number): Observable<any> {
    if (idUtilisateur) {
      return this.utilisateurService.delete(idUtilisateur);
    }
    return of(null);
  }

  setAccessToken(authenticationResponse: AuthenticationResponse): void {
    localStorage.setItem('accessToken', JSON.stringify(authenticationResponse));
  }

  setConnectedUser(utilisateur: UtilisateurDto): void {
    localStorage.setItem('connectedUser', JSON.stringify(utilisateur));
  }

  getConnectedUser(): UtilisateurDto {
    if (localStorage.getItem('connectedUser')) {
      return JSON.parse(localStorage.getItem('connectedUser') as string);
    }
    return {};
  }

  changerMotDePasse(changerMotDePasseDto: ChangerMotDePasseUtilisateurDto): Observable<ChangerMotDePasseUtilisateurDto> {
    return this.utilisateurService.changerMotDePasse(changerMotDePasseDto);
  }

  /**
   * Session valide si un access token existe ET que le couple access/refresh est coherent.
   * L'intercepteur renouvelle automatiquement l'access token expire via le refresh token.
   */
  isUserLoggedAndAccessTokenValid(): boolean {
    const stored = localStorage.getItem('accessToken');
    if (!stored) {
      this.router.navigate(['login']);
      return false;
    }
    try {
      const session = JSON.parse(stored) as AuthenticationResponse;
      if (!session.accessToken) {
        this.router.navigate(['login']);
        return false;
      }
      return true;
    } catch {
      this.router.navigate(['login']);
      return false;
    }
  }
}
