package com.projects.vidyara.backend.forum.service;

import com.projects.vidyara.backend.forum.dto.AnswerDto;

import java.util.List;
import java.util.UUID;

public interface AnswerService {

    AnswerDto createAnswer(AnswerDto answerDto);

    AnswerDto getAnswerById(UUID id);

    List<AnswerDto> getAllAnswer();

    AnswerDto updateAnswer(UUID id, AnswerDto answerDto);

    void deleteAnswer(UUID id);
}
