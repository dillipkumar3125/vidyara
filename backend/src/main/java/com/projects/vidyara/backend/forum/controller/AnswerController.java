package com.projects.vidyara.backend.forum.controller;

import com.projects.vidyara.backend.forum.dto.AnswerDto;
import com.projects.vidyara.backend.forum.service.AnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/forum/questions/{questionId}/answers")
@RequiredArgsConstructor
public class AnswerController {

    private final AnswerService answerService;

    @PostMapping
    public ResponseEntity<AnswerDto> createAnswer(
            @PathVariable UUID questionId,
            @RequestBody AnswerDto answerDto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(answerService.createAnswer(questionId, answerDto));
    }

    @GetMapping("/{answerId}")
    public ResponseEntity<AnswerDto> getAnswerById(
            @PathVariable UUID answerId) {

        return ResponseEntity.ok(
                answerService.getAnswerById(answerId));
    }

    @GetMapping
    public ResponseEntity<List<AnswerDto>> getAnswersByQuestion(
            @PathVariable UUID questionId) {

        return ResponseEntity.ok(
                answerService.getAllAnswersOfQuestion(questionId));
    }

    @PutMapping("/{answerId}")
    public ResponseEntity<AnswerDto> updateAnswer(
            @PathVariable UUID answerId,
            @RequestBody AnswerDto answerDto) {

        return ResponseEntity.ok(
                answerService.updateAnswer(answerId, answerDto));
    }

    @DeleteMapping("/{answerId}")
    public ResponseEntity<Void> deleteAnswer(
            @PathVariable UUID answerId) {
        answerService.deleteAnswer(answerId);
        return ResponseEntity.noContent().build();
    }
}


