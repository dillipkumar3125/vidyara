package com.projects.vidyara.backend.forum.service;

import com.projects.vidyara.backend.forum.dto.QuestionDto;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.UUID;

public interface QuestionService {

    QuestionDto createQuestion(QuestionDto questionDto) ;

    QuestionDto getQuestionById(UUID id) ;

    List<QuestionDto> getAllQuestions() ;

    List<QuestionDto> getAllQuestionsOfUser(UUID userId) ;

    QuestionDto updateQuestion(UUID id, QuestionDto questionDto) throws AccessDeniedException;

    void deleteQuestion(UUID id) throws AccessDeniedException;
}
