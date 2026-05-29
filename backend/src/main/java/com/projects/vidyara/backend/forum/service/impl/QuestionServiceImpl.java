package com.projects.vidyara.backend.forum.service.impl;

import com.projects.vidyara.backend.auth.controller.AuthController;
import com.projects.vidyara.backend.forum.dto.QuestionDto;
import com.projects.vidyara.backend.forum.entity.Question;
import com.projects.vidyara.backend.forum.mapper.QuestionMapper;
import com.projects.vidyara.backend.forum.repository.QuestionRepository;
import com.projects.vidyara.backend.forum.service.QuestionService;
import com.projects.vidyara.backend.shared.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.Instant;
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
    public List<QuestionDto> getAllQuestions() {
        List<Question> questions = questionRepository.findAll() ;

        return questions
                .stream()
                .map(mapper::toDto)
                .toList() ;
    }

    @Override
    public List<QuestionDto> getAllQuestionsOfUser(UUID userId) {
        List<Question> questions = questionRepository.findByUserId(userId) ;
        return questions.stream()
                .map(mapper::toDto)
                .toList() ;
    }

    @Override
    @Transactional
    public QuestionDto updateQuestion(UUID id, QuestionDto questionDto) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("There is no question with Id: " + id));

        checkAccess(question);

        question.setHeading(questionDto.getHeading());
        question.setContent(questionDto.getContent());
        question.setUpdatedAt(Instant.now());

        return mapper.toDto(question) ;
    }

    @Override
    public void deleteQuestion(UUID id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("There is no question with Id: " + id));

        checkAccess(question);

        questionRepository.delete(question);
    }

    private void checkAccess(Question question) {
        UUID userId = question.getUserId() ;
        UUID currentUserId = Objects.requireNonNull(authController.getCurrentUser().getBody()).getUser().getId();
        if(!currentUserId.equals(userId)) throw new AccessDeniedException("This is NOT your Question") ;
    }
}
