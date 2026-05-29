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
@RequestMapping("/forum/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<QuestionDto> createQuestion(
            @RequestBody QuestionDto questionDto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(questionService.createQuestion(questionDto));
    }

    @GetMapping("/{questionId}")
    public ResponseEntity<QuestionDto> getQuestionById(
            @PathVariable UUID questionId) {

        return ResponseEntity.ok(questionService.getQuestionById(questionId));
    }

    @GetMapping
    public ResponseEntity<List<QuestionDto>> getAllQuestions() {

        return ResponseEntity.ok(questionService.getAllQuestions());
    }


    @PutMapping("/{questionId}")
    public ResponseEntity<QuestionDto> updateQuestion(
            @PathVariable UUID questionId,
            @RequestBody QuestionDto questionDto) {

        return ResponseEntity.ok(
                questionService.updateQuestion(questionId, questionDto));
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable UUID questionId) {

        questionService.deleteQuestion(questionId);
        return ResponseEntity.noContent().build();
    }
}
