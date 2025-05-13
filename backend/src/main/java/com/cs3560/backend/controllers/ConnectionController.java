package com.cs3560.backend.controllers;

import com.cs3560.backend.models.Connection;
import com.cs3560.backend.models.Person;
import com.cs3560.backend.repositories.ConnectionRepo;
import com.cs3560.backend.repositories.PersonRepo;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    @Autowired
    private ConnectionRepo connectionRepo;

    @Autowired
    private PersonRepo personRepo;

    @GetMapping
    public List<Connection> getAllConnection() {
        return connectionRepo.findAll();
    }

    @GetMapping("/{id}")
    public List<Connection> getAllConnectionsForId(@PathVariable Long id) {
        if (id == null) {
            return null;
        }

        return connectionRepo.findAll().stream()
                .filter(c -> c.getSource().getId().equals(id) || c.getTarget().getId().equals(id))
                .toList();
    }

    @PostMapping
    public Connection createConnection(@RequestBody Map<String, Long> body) {
        Long sourceId = body.get("source");
        Long targetId = body.get("target");

        Person source = personRepo.findById(sourceId).orElse(null);
        Person target = personRepo.findById(targetId).orElse(null);

        if (source == null || target == null)
            return null;
        Connection connection = new Connection();
        connection.setSource(source);
        connection.setTarget(target);

        return connectionRepo.save(connection);
    }

    @PutMapping("/{id}")
    public String updateConnection(@RequestBody Map<String, Long> body) {
        Long sourceId = body.get("sourceId");
        Long oldTargetId = body.get("oldTargetId");
        Long newTargetId = body.get("newTargetId");
        if (sourceId == null || oldTargetId == null || newTargetId == null)
            return "Invalid input";

        Person source = personRepo.findById(sourceId).orElse(null);
        Person oldTarget = personRepo.findById(oldTargetId).orElse(null);
        Person newTarget = personRepo.findById(newTargetId).orElse(null);
        if (source == null || oldTarget == null || newTarget == null)
            return "Source or Target not found";

        // Delete the old connection
        // Delete all connections where the person is involved
        List<Connection> toDelete = connectionRepo.findAll().stream()
                .filter(c -> c.getSource().getId().equals(sourceId) || c.getTarget().getId().equals(oldTargetId))
                .toList();

        connectionRepo.deleteAll(toDelete);

        // Create a new connection
        Connection newConnection = new Connection();

        newConnection.setSource(source);
        newConnection.setTarget(oldTarget);

        connectionRepo.save(newConnection);
        return "Connection updated successfully";
    }

    @DeleteMapping("/by-name/{name}")
    public void deleteConnectionsAndPersonByName(@PathVariable String name) {
        // Find the person by name
        Person person = personRepo.findAll().stream()
                .filter(p -> p.getName().equals(name))
                .findFirst()
                .orElse(null);

        if (person == null)
            return;

        // Delete all connections where the person is involved
        List<Connection> toDelete = connectionRepo.findAll().stream()
                .filter(c -> c.getSource().getName().equals(name) || c.getTarget().getName().equals(name))
                .toList();

        connectionRepo.deleteAll(toDelete);

        // Finally, delete the person
        personRepo.delete(person);
    }

}
