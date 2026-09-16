package com.k48.gestiondestock.config;

import com.k48.gestiondestock.services.auth.ApplicationUserDetailsService;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.session.SessionManagementFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

  @Autowired
  private ApplicationUserDetailsService applicationUserDetailsService;

  @Autowired
  private ApplicationRequestFilter applicationRequestFilter;

  @Value("${app.cors.allowed-origins}")
  private List<String> allowedOrigins;

  @Override
  protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.userDetailsService(applicationUserDetailsService)
    .passwordEncoder(passwordEncoder())
    ;
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.addFilterBefore(corsFilter(), SessionManagementFilter.class)
        .csrf().disable()
        .authorizeRequests().antMatchers("/**/authenticate",
        "/**/entreprises/create",
        "/v2/api-docs",
        "/swagger-resources",
        "/swagger-resources/**",
        "/configuration/ui",
        "/configuration/security",
        "/swagger-ui.html",
        "/webjars/**",
        "/v3/api-docs/**",
        "/swagger-ui/**").permitAll()
        .anyRequest().authenticated()
        .and().sessionManagement()
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
    ;

    http.addFilterBefore(applicationRequestFilter, UsernamePasswordAuthenticationFilter.class);
  }

  @Bean
  public CorsFilter corsFilter() {
    final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    final CorsConfiguration config = new CorsConfiguration();
    config.setAllowCredentials(true);
    // En production, definir CORS_ALLOWED_ORIGINS avec la liste des origines autorisees
    config.setAllowedOriginPatterns(allowedOrigins);
    config.setAllowedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Authorization"));
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "OPTIONS", "DELETE", "PATCH"));
    source.registerCorsConfiguration("/**", config);
    // some comment here
    return new CorsFilter(source);
  }

  @Bean
  public AuthenticationManager customAuthenticationManager() throws Exception {
    return authenticationManagerBean();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
