package com.cs3560.backend.repositories;

import com.cs3560.backend.models.Person;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonRepo extends JpaRepository<Person, Long> {
}
