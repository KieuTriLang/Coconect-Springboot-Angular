package com.ktl.server.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@AllArgsConstructor
@Builder
@NoArgsConstructor
@Data
public class ApiException {

    private String message;
}