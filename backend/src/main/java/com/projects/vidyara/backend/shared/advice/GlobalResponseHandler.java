package com.projects.vidyara.backend.shared.advice;

import org.jspecify.annotations.Nullable;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@RestControllerAdvice
public class GlobalResponseHandler implements ResponseBodyAdvice<Object> {
    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public @Nullable Object beforeBodyWrite(@Nullable Object body, MethodParameter returnType, MediaType selectedContentType, Class<? extends HttpMessageConverter<?>> selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {

        String path = request.getURI().getPath();

        // Exclude Swagger/OpenAPI endpoints
        if (path.startsWith("/v3/api-docs")
                || path.startsWith("/swagger-ui")
                || path.contains("swagger")) {
            return body;
        }
        if(body instanceof ApiResponse<?>) return body ;

        // Exclude raw byte responses
        if (body instanceof byte[]) return body;

        // Exclude String responses
        if (body instanceof String) return body;


        return new ApiResponse<>(body) ;
    }
}
