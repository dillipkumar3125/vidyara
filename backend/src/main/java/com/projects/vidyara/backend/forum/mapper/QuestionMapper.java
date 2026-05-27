package com.projects.vidyara.backend.forum.mapper;

import com.projects.vidyara.backend.forum.dto.QuestionDto;
import com.projects.vidyara.backend.forum.entity.Question;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface QuestionMapper {
    Question toEntity(QuestionDto questionDto) ;
    QuestionDto toDto(Question question) ;
}
