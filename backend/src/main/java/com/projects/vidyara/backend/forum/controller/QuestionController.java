package com.projects.vidyara.backend.forum.controller;

import com.projects.vidyara.backend.forum.dto.QuestionDto;
import com.projects.vidyara.backend.forum.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "/forum/question")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<QuestionDto> createQuestion(@RequestBody QuestionDto questionDto) {

        QuestionDto createdQuestion = questionService.createQuestion(questionDto);

        return new ResponseEntity<>(createdQuestion, HttpStatus.CREATED);
    }

    @GetMapping("/{questionId}")
    public ResponseEntity<QuestionDto> getQuestionById(@PathVariable UUID id) {

        QuestionDto question = questionService.getQuestionById(id);

        return ResponseEntity.ok(question);
    }

    @GetMapping
    public ResponseEntity<List<QuestionDto>> getAllQuestion() {

        List<QuestionDto> questions = questionService.getAllQuestion();

        return ResponseEntity.ok(questions);
    }

    @PutMapping("/{questionId}")
    public ResponseEntity<QuestionDto> updateQuestion(
            @PathVariable UUID questionId,
            @RequestBody QuestionDto questionDto
    ) throws AccessDeniedException {

        QuestionDto updatedQuestion = questionService.updateQuestion(questionId, questionDto);

        return ResponseEntity.ok(updatedQuestion);
    }

    @DeleteMapping("/{questionId}")
    public void deleteQuestion(@PathVariable UUID questionId) throws AccessDeniedException {
        questionService.deleteQuestion(questionId);
    }
}
