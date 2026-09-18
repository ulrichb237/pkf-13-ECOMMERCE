package com.k48.gestiondestock.config;

import static com.k48.gestiondestock.utils.Constants.AUTHENTIFICATION_ENDPOINT;
import static com.k48.gestiondestock.utils.Constants.ENTREPRISES_ENDPOINT;

import com.k48.gestiondestock.services.auth.ApplicationUserDetailsService;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

  @Value("${app.cors.allowed-origins}")
  private List<String> allowedOrigins;

  // Les dependances sont injectees en parametres des methodes @Bean pour eviter une reference circulaire
  // (ApplicationRequestFilter -> UtilisateurService -> PasswordEncoder -> SecurityConfiguration)
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http, ApplicationRequestFilter applicationRequestFilter) throws Exception {
    http
        .cors(Customizer.withDefaults())
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.POST, AUTHENTIFICATION_ENDPOINT + "/connexion",
                AUTHENTIFICATION_ENDPOINT + "/refresh", AUTHENTIFICATION_ENDPOINT + "/deconnexion",
                AUTHENTIFICATION_ENDPOINT + "/mot-de-passe-oublie", AUTHENTIFICATION_ENDPOINT + "/reinitialisation",
                ENTREPRISES_ENDPOINT).permitAll()
            .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/error").permitAll()
            .anyRequest().authenticated())
        // Sans jeton valide, l'API repond 401 (et non 403)
        .exceptionHandling(exceptions -> exceptions.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
        .addFilterBefore(applicationRequestFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    final CorsConfiguration config = new CorsConfiguration();
    config.setAllowCredentials(true);
    // En production, definir CORS_ALLOWED_ORIGINS avec la liste des origines autorisees
    config.setAllowedOriginPatterns(allowedOrigins);
    config.setAllowedHeaders(List.of("Origin", "Content-Type", "Accept", "Authorization"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "OPTIONS", "DELETE", "PATCH"));
    final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }

  @Bean
  public AuthenticationManager authenticationManager(ApplicationUserDetailsService applicationUserDetailsService,
      PasswordEncoder passwordEncoder) {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider(applicationUserDetailsService);
    provider.setPasswordEncoder(passwordEncoder);
    return new ProviderManager(provider);
  }

  @Bean
  public static PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
