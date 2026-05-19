package com.projects.vidyara.backend.shared.advice;

import lombok.Data;

import java.time.Instant;

@Data
public class ApiResponse<T> {
    private T data ;
    private ApiException exception ;
    private Instant timeStamp ;

    public ApiResponse () {
        timeStamp = Instant.now() ;
    }

    public ApiResponse(T data) {
        this() ;
        this.data = data ;
    }

    public ApiResponse(ApiException apiException) {
        this() ;
        this.exception = apiException ;
    }
}
