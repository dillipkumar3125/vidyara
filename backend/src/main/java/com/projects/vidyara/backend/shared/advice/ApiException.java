package com.projects.vidyara.backend.shared.advice;

import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.util.List;

@Data
@Builder
public class ApiException {
    private String message ;
    private HttpStatus httpStatus ;
    private List<String> subErrors ;
}
