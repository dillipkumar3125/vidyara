package com.projects.vidyara.backend.shared.advice;

import com.projects.vidyara.backend.shared.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> resourceNotFoundExceptionHandler(ResourceNotFoundException exception) {
        ApiException apiException = ApiException.builder()
                .message(exception.getMessage())
                .httpStatus(HttpStatus.NOT_FOUND)
                .build() ;
        return exceptionToResponse(apiException) ;
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> internalExceptionHandler(Exception exception) {
        ApiException apiException = ApiException.builder()
                .message(exception.getMessage())
                .httpStatus(HttpStatus.INTERNAL_SERVER_ERROR)
                .build() ;
        return exceptionToResponse(apiException) ;
    }

    public ResponseEntity<ApiResponse<?>> exceptionToResponse(ApiException exception) {
        return new ResponseEntity<>(new ApiResponse<>(exception) ,exception.getHttpStatus()) ;
    }
}
