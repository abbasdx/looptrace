package com.looptrace.controller;
import com.looptrace.dto.*;
import com.looptrace.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/admin") @RequiredArgsConstructor
public class AdminController {
    private final AdminService service;
    @GetMapping("/dashboard") public Object dashboard() { return service.dashboard(); }
    @GetMapping("/participants") public Object participants() { return service.participants(); }
    @GetMapping("/participants/{id}") public Object participant(@PathVariable String id) { return service.participant(id); }
    @PostMapping("/participants") public Object create(@Valid @RequestBody ParticipantRequest request) { return service.create(request); }
    @PatchMapping("/participants/{id}/status") public Object status(@PathVariable String id, @Valid @RequestBody StatusRequest request) { return service.status(id, request.getStatus()); }
    @DeleteMapping("/participants/{id}") public void remove(@PathVariable String id) { service.remove(id); }
    @GetMapping("/applications") public Object applications() { return service.applications(); }
    @PostMapping("/applications/{id}/approve") public Object approve(@PathVariable String id) { return service.decide(id, true); }
    @PostMapping("/applications/{id}/reject") public Object reject(@PathVariable String id) { return service.decide(id, false); }
    @GetMapping("/eligible-collectors") public Object collectors() { return service.eligibleCollectors(); }
    @GetMapping("/eligible-recyclers") public Object recyclers() { return service.eligibleRecyclers(); }
    @PostMapping("/pickups/{id}/assign") public Object assign(@PathVariable String id, @Valid @RequestBody AssignmentRequest request) { return service.assign(id, request.getCollectorId()); }
}
