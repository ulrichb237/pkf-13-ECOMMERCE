package com.k48.gestiondestock.model;

import java.io.Serializable;
import java.time.Instant;
import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.SequenceGenerator;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Data
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class AbstractEntity implements Serializable {

  // Table "hibernate_sequence" partagee par toutes les entites, comme avec Hibernate 5
  // (sans cela, Hibernate 7 cree une table "<entite>_seq" par entite)
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hibernate_sequence")
  @SequenceGenerator(name = "hibernate_sequence", sequenceName = "hibernate_sequence", allocationSize = 1)
  private Integer id;

  @CreatedDate
  @Column(name = "creationDate", nullable = false, updatable = false)
  private Instant creationDate;

  @LastModifiedDate
  @Column(name = "lastModifiedDate")
  private Instant lastModifiedDate;


}
