package com.projects.vidyara.backend.forum.service.impl;

import com.projects.vidyara.backend.auth.controller.AuthController;
import com.projects.vidyara.backend.forum.dto.AnswerDto;
import com.projects.vidyara.backend.forum.entity.Answer;
import com.projects.vidyara.backend.forum.entity.Question;
import com.projects.vidyara.backend.forum.mapper.AnswerMapper;
import com.projects.vidyara.backend.forum.repository.AnswerRepository;
import com.projects.vidyara.backend.forum.repository.QuestionRepository;
import com.projects.vidyara.backend.forum.service.AnswerService;
import com.projects.vidyara.backend.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AnswerServiceImpl implements AnswerService {
    private final AuthController authController ;
    private final AnswerRepository answerRepository ;
    private final QuestionRepository questionRepository ;
    private final AnswerMapper mapper ;

    @Override
    public AnswerDto createAnswer(UUID questionId,AnswerDto answerDto) {

        Question question = questionRepository.findById(questionId).orElseThrow(() -> new ResourceNotFoundException("There is no question with Id: " + questionId)) ;

        Answer answer = mapper.toEntity(answerDto) ;
        UUID userId = Objects.requireNonNull(authController.getCurrentUser().getBody()).getUser().getId();
        answer.setUserId(userId);
        answer.setQuestion(question);

        answerRepository.save(answer) ;
        return mapper.toDto(answer) ;
    }

    @Override
    public AnswerDto getAnswerById(UUID id) {
        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("There is no answer with Id: " + id)) ;
        return mapper.toDto(answer) ;
    }


    @Override
    public List<AnswerDto> getAllAnswersOfQuestion(UUID questionId) {
        Question question = questionRepository.findById(questionId).orElseThrow(() -> new ResourceNotFoundException("There is no question with Id: " + questionId)) ;

        List<Answer> answers = answerRepository.findByQuestion(question) ;

        return answers.stream()
                .map(mapper::toDto)
                .toList() ;
    }

    @Override
    public AnswerDto updateAnswer(UUID id, AnswerDto answerDto) {
        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("There is no answer with Id: " + id)) ;

        checkAccess(answer);

        answer.setContent(answerDto.getContent());
        answer.setUpdatedAt(Instant.now());
        answerRepository.save(answer) ;

        return mapper.toDto(answer) ;
    }

    @Override
    public void deleteAnswer(UUID id) {
        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("There is no answer with Id: " + id)) ;

        checkAccess(answer);

        answerRepository.delete(answer);
    }

    private void checkAccess(Answer answer) {
        UUID userId = answer.getUserId() ;
        UUID currentUserId = Objects.requireNonNull(authController.getCurrentUser().getBody()).getUser().getId();
        if(!currentUserId.equals(userId)) throw new AccessDeniedException("This is NOT your Answer") ;}
}
