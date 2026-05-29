package com.projects.vidyara.backend.forum.service;

import com.projects.vidyara.backend.forum.dto.AnswerDto;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.UUID;

public interface AnswerService {

    AnswerDto createAnswer(UUID questionId,AnswerDto answerDto);

    AnswerDto getAnswerById(UUID id);

    List<AnswerDto> getAllAnswersOfQuestion(UUID questionId);

    AnswerDto updateAnswer(UUID id, AnswerDto answerDto) throws AccessDeniedException;

    void deleteAnswer(UUID id);
}
