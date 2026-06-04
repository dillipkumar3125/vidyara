package com.projects.vidyara.backend.library.mapper;

import com.projects.vidyara.backend.library.dto.DocumentRequest;
import com.projects.vidyara.backend.library.dto.DocumentResponse;
import com.projects.vidyara.backend.library.entity.Document;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DocumentMapper {
    DocumentResponse toResponse(Document document) ;
    Document toEntity(DocumentRequest request) ;
}
