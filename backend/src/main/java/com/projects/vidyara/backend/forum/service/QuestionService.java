package com.projects.vidyara.backend.forum.service;

import com.projects.vidyara.backend.forum.dto.QuestionDto;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.UUID;

public interface QuestionService {

    QuestionDto createQuestion(QuestionDto questionDto) ;

    QuestionDto getQuestionById(UUID id) ;

    List<QuestionDto> getAllQuestion() ;

    QuestionDto updateQuestion(UUID id, QuestionDto questionDto) throws AccessDeniedException;

    void deleteQuestion(UUID id) throws AccessDeniedException;
}
