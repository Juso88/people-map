package com.cs3560.backend.controllers;

import com.cs3560.backend.models.Person;
import com.cs3560.backend.repositories.PersonRepo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/people")
public class PersonController {

    @Autowired
    private PersonRepo personRepo;

    @GetMapping
    public List<Person> getAllPersons() {
        return personRepo.findAll();
    }

    @PostMapping
    public Person createPerson(@RequestBody Person person) {
        return personRepo.save(person);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Person> getPersonById(@PathVariable Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }

        return personRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-name/{name}")
    public ResponseEntity<Person> getPersonByName(@PathVariable String name) {
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        return personRepo.findAll().stream()
                .filter(p -> p.getName().equals(name))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    public Person updatePerson(@PathVariable Long id, @RequestBody Person person) {
        Person existingPerson = personRepo.findById(id).orElse(null);
        if (existingPerson != null) {
            existingPerson.setName(person.getName());
            existingPerson.setDescription(person.getDescription());
            return personRepo.save(existingPerson);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deletePerson(@PathVariable Long id) {
        personRepo.deleteById(id);
    }
}
