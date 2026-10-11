package com.looptrace.service;

import com.looptrace.repository.LoopTraceStore;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;

class CustodyServiceTest {

    @Test
    void emptyChainIsNotValid() {
        CustodyService service = new CustodyService(new LoopTraceStore());

        assertFalse(service.verifyChain("missing-request"));
    }
}
