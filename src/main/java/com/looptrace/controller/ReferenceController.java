package com.looptrace.controller;

import com.looptrace.dto.ImpactResponse;
import com.looptrace.model.Collector;
import com.looptrace.model.Recycler;
import com.looptrace.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReferenceController {

    private final CollectorService collectorService;
    private final RecyclerService recyclerService;
    private final ImpactService impactService;

    @GetMapping("/collectors")
    public List<Collector> collectors() { return collectorService.getAllCollectors(); }

    @GetMapping("/recyclers")
    public List<Recycler> recyclers() { return recyclerService.getAllRecyclers(); }

    @GetMapping("/impact")
    public ImpactResponse impact() { return impactService.getImpact(); }
}