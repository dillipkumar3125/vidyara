package com.projects.vidyara.backend.forum.service.impl;

import com.projects.vidyara.backend.auth.controller.AuthController;
import com.projects.vidyara.backend.forum.dto.AnswerDto;
import com.projects.vidyara.backend.forum.repository.AnswerRepository;
import com.projects.vidyara.backend.forum.service.AnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AnswerServiceImpl implements AnswerService {
    private final AuthController authController ;
    private final AnswerRepository answerRepository ;

    @Override
    public AnswerDto createAnswer(AnswerDto answerDto) {
        return null;
    }

    @Override
    public AnswerDto getAnswerById(UUID id) {
        return null;
    }

    @Override
    public List<AnswerDto> getAllAnswer() {
        return List.of();
    }

    @Override
    public AnswerDto updateAnswer(UUID id, AnswerDto answerDto) {
        return null;
    }

    @Override
    public void deleteAnswer(UUID id) {

    }
}
