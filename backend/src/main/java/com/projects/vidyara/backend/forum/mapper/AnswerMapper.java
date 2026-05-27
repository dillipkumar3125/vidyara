package com.projects.vidyara.backend.forum.mapper;

import com.projects.vidyara.backend.forum.dto.AnswerDto;
import com.projects.vidyara.backend.forum.entity.Answer;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AnswerMapper {
    Answer toEntity(AnswerDto answerDto) ;
    AnswerDto toDto(Answer answer) ;
}
