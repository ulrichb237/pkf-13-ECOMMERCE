package com.k48.gestiondestock.config;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.LinkedHashMap;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.boot.logging.DeferredLogFactory;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.StandardEnvironment;

/**
 * Charge le fichier .env (le meme que docker compose) quand l'API est lancee hors Docker (IDE, mvn).
 * Le fichier est cherche dans le repertoire courant puis dans les parents, jusqu'a la racine du depot git.
 * Les vraies variables d'environnement restent prioritaires.
 */
public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor {

  private static final String FILE_NAME = ".env";

  private final Log log;

  public DotenvEnvironmentPostProcessor(DeferredLogFactory logFactory) {
    this.log = logFactory.getLog(DotenvEnvironmentPostProcessor.class);
  }

  @Override
  public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
    Path envFile = findEnvFile();
    if (envFile == null) {
      return;
    }
    environment.getPropertySources().addAfter(
        StandardEnvironment.SYSTEM_ENVIRONMENT_PROPERTY_SOURCE_NAME,
        new MapPropertySource("dotenv [" + envFile + "]", parse(envFile))
    );
    log.info("Variables d'environnement chargees depuis " + envFile);
  }

  private Path findEnvFile() {
    Path dir = Paths.get("").toAbsolutePath();
    while (dir != null) {
      Path candidate = dir.resolve(FILE_NAME);
      if (Files.isRegularFile(candidate)) {
        return candidate;
      }
      if (Files.exists(dir.resolve(".git"))) {
        return null;
      }
      dir = dir.getParent();
    }
    return null;
  }

  private Map<String, Object> parse(Path envFile) {
    Map<String, Object> values = new LinkedHashMap<>();
    try {
      for (String line : Files.readAllLines(envFile, StandardCharsets.UTF_8)) {
        String trimmed = line.trim();
        int separator = trimmed.indexOf('=');
        if (trimmed.startsWith("#") || separator < 1) {
          continue;
        }
        String value = unquote(trimmed.substring(separator + 1).trim());
        // Une valeur vide est ignoree : le placeholder Spring echoue alors comme si la variable etait absente
        if (!value.isEmpty()) {
          values.put(trimmed.substring(0, separator).trim(), value);
        }
      }
    } catch (IOException e) {
      throw new IllegalStateException("Impossible de lire " + envFile, e);
    }
    return values;
  }

  private String unquote(String value) {
    if (value.length() >= 2) {
      char quote = value.charAt(0);
      if ((quote == '\'' || quote == '"') && value.charAt(value.length() - 1) == quote) {
        return value.substring(1, value.length() - 1);
      }
    }
    return value;
  }
}
