package com.cs3560.backend.repositories;

import com.cs3560.backend.models.Connection;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConnectionRepo extends JpaRepository<Connection, Long> {
}
