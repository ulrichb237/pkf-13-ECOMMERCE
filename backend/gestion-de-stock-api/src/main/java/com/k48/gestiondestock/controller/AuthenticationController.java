package com.k48.gestiondestock.controller;


import com.k48.gestiondestock.controller.api.AuthenticationApi;
import com.k48.gestiondestock.dto.UtilisateurDto;
import com.k48.gestiondestock.dto.auth.AuthenticationRequest;
import com.k48.gestiondestock.dto.auth.AuthenticationResponse;
import com.k48.gestiondestock.dto.auth.ForgotPasswordRequest;
import com.k48.gestiondestock.dto.auth.ForgotPasswordResponse;
import com.k48.gestiondestock.dto.auth.RefreshTokenRequest;
import com.k48.gestiondestock.dto.auth.ResetPasswordRequest;
import com.k48.gestiondestock.model.RefreshToken;
import com.k48.gestiondestock.model.auth.ExtendedUser;
import com.k48.gestiondestock.services.auth.ApplicationUserDetailsService;
import com.k48.gestiondestock.services.auth.PasswordResetService;
import com.k48.gestiondestock.services.auth.RefreshTokenService;
import com.k48.gestiondestock.services.UtilisateurService;
import com.k48.gestiondestock.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthenticationController implements AuthenticationApi {

  @Autowired
  private AuthenticationManager authenticationManager;

  @Autowired
  private ApplicationUserDetailsService userDetailsService;

  @Autowired
  private JwtUtil jwtUtil;

  @Autowired
  private RefreshTokenService refreshTokenService;

  @Autowired
  private UtilisateurService utilisateurService;

  @Autowired
  private PasswordResetService passwordResetService;

  @Value("${jwt.expiration-ms:36000000}")
  private long expirationMs;

  @Override
  public ResponseEntity<AuthenticationResponse> authenticate(AuthenticationRequest request) {
    final Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getLogin(),
            request.getPassword()
        )
    );
    final ExtendedUser userDetails = (ExtendedUser) authentication.getPrincipal();

    return ResponseEntity.ok(construireReponse(userDetails));
  }

  @Override
  public ResponseEntity<AuthenticationResponse> refresh(RefreshTokenRequest request) {
    // Valide le jeton (existence + expiration) et retrouve l'utilisateur
    final RefreshToken refreshToken = refreshTokenService.valider(request.getRefreshToken());
    final UtilisateurDto utilisateur = utilisateurService.findById(refreshToken.getIdUtilisateur());

    final ExtendedUser userDetails = (ExtendedUser) userDetailsService.loadUserByUsername(utilisateur.getEmail());
    // Rotation : l'ancien jeton est revoque, un nouveau est emis
    return ResponseEntity.ok(construireReponse(userDetails));
  }

  @Override
  public ResponseEntity<Void> deconnexion(RefreshTokenRequest request) {
    refreshTokenService.revoquer(request.getRefreshToken());
    return ResponseEntity.ok().build();
  }

  @Override
  public ResponseEntity<ForgotPasswordResponse> forgotPassword(ForgotPasswordRequest request) {
    final String code = passwordResetService.demandReinitialisation(request.getEmail());
    if (code == null) {
      // Anti-enumeration : reponse identique que l'email existe ou non
      return ResponseEntity.ok(ForgotPasswordResponse.builder()
          .message("Si un compte existe pour cet email, un code de reinitialisation vient d'etre genere.")
          .build());
    }
    // Sans SMTP configure, le code est renvoye pour permettre le parcours (voir MODIFICATIONS_BACKEND.md)
    return ResponseEntity.ok(ForgotPasswordResponse.builder()
        .message("Code de reinitialisation genere. Il est valable 15 minutes.")
        .code(code)
        .build());
  }

  @Override
  public ResponseEntity<Void> reinitialiserMotDePasse(ResetPasswordRequest request) {
    passwordResetService.confirmerReinitialisation(request.getCode(), request.getNouveauMotDePasse());
    return ResponseEntity.ok().build();
  }

  /** Genere le couple access/refresh + rotation du refresh token */
  private AuthenticationResponse construireReponse(ExtendedUser userDetails) {
    final String jwt = jwtUtil.generateToken(userDetails);
    final Integer idUtilisateur = idUtilisateurDepuis(userDetails);
    final RefreshToken refresh = refreshTokenService.creer(idUtilisateur);

    return AuthenticationResponse.builder()
        .accessToken(jwt)
        .refreshToken(refresh.getJeton())
        .expiresIn(expirationMs / 1000)
        .email(userDetails.getUsername())
        .build();
  }

  /** ExtendedUser ne porte pas l'id utilisateur : on le retrouve par email */
  private Integer idUtilisateurDepuis(ExtendedUser userDetails) {
    return utilisateurService.findByEmail(userDetails.getUsername()).getId();
  }
}
