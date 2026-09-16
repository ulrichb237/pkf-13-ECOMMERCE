package com.k48.gestiondestock.config;

import com.k48.gestiondestock.exception.EntityNotFoundException;
import com.k48.gestiondestock.services.auth.ApplicationUserDetailsService;
import com.k48.gestiondestock.utils.JwtUtil;
import io.jsonwebtoken.JwtException;
import java.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class ApplicationRequestFilter extends OncePerRequestFilter {

  private static final String ID_ENTREPRISE = "idEntreprise";

  @Autowired
  private JwtUtil jwtUtil;

  @Autowired
  private ApplicationUserDetailsService userDetailsService;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {

    // Le MDC est lie au thread, et Tomcat reutilise ses threads : sans ce nettoyage, la recherche de l'utilisateur
    // ci-dessous serait filtree avec l'entreprise de la requete precedente
    MDC.remove(ID_ENTREPRISE);
    try {
      authenticate(request);
      chain.doFilter(request, response);
    } finally {
      MDC.remove(ID_ENTREPRISE);
    }
  }

  private void authenticate(HttpServletRequest request) {
    final String authHeader = request.getHeader("Authorization");
    if (authHeader == null || !authHeader.startsWith("Bearer ") || SecurityContextHolder.getContext().getAuthentication() != null) {
      return;
    }

    final String jwt = authHeader.substring(7);
    try {
      final String userEmail = jwtUtil.extractUsername(jwt);
      final UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
      if (jwtUtil.validateToken(jwt, userDetails)) {
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
            userDetails, null, userDetails.getAuthorities()
        );
        usernamePasswordAuthenticationToken.setDetails(
            new WebAuthenticationDetailsSource().buildDetails(request)
        );
        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
        MDC.put(ID_ENTREPRISE, jwtUtil.extractIdEntreprise(jwt));
      }
    } catch (JwtException | IllegalArgumentException | EntityNotFoundException e) {
      // Jeton expire, mal forme, mal signe ou utilisateur supprime : la requete continue sans authentification (401)
      logger.debug("Jeton JWT rejete : " + e.getMessage());
    }
  }
}
