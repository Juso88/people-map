package com.cs3560.backend.controllers;

import com.cs3560.backend.models.Person;
import com.cs3560.backend.repositories.PersonRepo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
    public Person getPersonById(@PathVariable Long id) {
        return personRepo.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deletePerson(@PathVariable Long id) {
        personRepo.deleteById(id);
    }
}
