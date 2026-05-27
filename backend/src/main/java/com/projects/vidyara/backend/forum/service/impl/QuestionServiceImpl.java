package com.projects.vidyara.backend.forum.service.impl;

import com.projects.vidyara.backend.auth.controller.AuthController;
import com.projects.vidyara.backend.forum.dto.QuestionDto;
import com.projects.vidyara.backend.forum.entity.Question;
import com.projects.vidyara.backend.forum.mapper.QuestionMapper;
import com.projects.vidyara.backend.forum.repository.QuestionRepository;
import com.projects.vidyara.backend.forum.service.QuestionService;
import com.projects.vidyara.backend.shared.exception.ResourceNotFoundException;
import io.jsonwebtoken.JwtException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final AuthController authController ;
    private final QuestionRepository questionRepository ;
    private final QuestionMapper mapper ;

    @Override
    @Transactional
    public QuestionDto createQuestion(QuestionDto questionDto) {
        Question question = mapper.toEntity(questionDto) ;
        UUID userId = Objects.requireNonNull(authController.getCurrentUser().getBody()).getUser().getId();

        question.setUserId(userId);

        questionRepository.save(question) ;
        return mapper.toDto(question) ;
    }

    @Override
    public QuestionDto getQuestionById(UUID id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("There is no question with Id: " + id));
        return mapper.toDto(question) ;
    }

    @Override
    public List<QuestionDto> getAllQuestion() {
        List<Question> questions = questionRepository.findAll() ;

        return questions
                .stream()
                .map(mapper::toDto)
                .toList() ;
    }

    @Override
    @Transactional
    public QuestionDto updateQuestion(UUID id, QuestionDto questionDto) throws AccessDeniedException {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("There is no question with Id: " + id));
        UUID userId = question.getUserId() ;
        UUID currentUserId = Objects.requireNonNull(authController.getCurrentUser().getBody()).getUser().getId();

        if(currentUserId != userId) throw new AccessDeniedException("This is NOT your Question") ;

        question.setHeading(questionDto.getHeading());
        question.setContent(question.getContent());

        return mapper.toDto(question) ;
    }

    @Override
    public void deleteQuestion(UUID id) throws AccessDeniedException {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("There is no question with Id: " + id));
        UUID userId = question.getUserId() ;
        UUID currentUserId = Objects.requireNonNull(authController.getCurrentUser().getBody()).getUser().getId();

        if(currentUserId != userId) throw new AccessDeniedException("This is NOT your Question") ;

        questionRepository.delete(question);
    }
}
