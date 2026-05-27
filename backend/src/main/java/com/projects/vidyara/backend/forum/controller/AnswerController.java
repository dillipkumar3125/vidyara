package com.projects.vidyara.backend.forum.controller;

import com.projects.vidyara.backend.forum.dto.AnswerDto;
import com.projects.vidyara.backend.forum.service.AnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "/forum/answer")
@RequiredArgsConstructor
public class AnswerController {

    private final AnswerService answerService;

    @PostMapping
    public ResponseEntity<AnswerDto> createAnswer(@RequestBody AnswerDto answerDto) {

        AnswerDto createdAnswer = answerService.createAnswer(answerDto);

        return new ResponseEntity<>(createdAnswer, HttpStatus.CREATED);
    }

    @GetMapping("/{answerId}")
    public ResponseEntity<AnswerDto> getAnswerById(@PathVariable UUID id) {

        AnswerDto answer = answerService.getAnswerById(id);

        return ResponseEntity.ok(answer);
    }

    @GetMapping
    public ResponseEntity<List<AnswerDto>> getAllAnswer() {

        List<AnswerDto> answers = answerService.getAllAnswer();

        return ResponseEntity.ok(answers);
    }

    @PutMapping("/{answerId}")
    public ResponseEntity<AnswerDto> updateAnswer(
            @PathVariable UUID id,
            @RequestBody AnswerDto answerDto
    ) {

        AnswerDto updatedAnswer = answerService.updateAnswer(id, answerDto);

        return ResponseEntity.ok(updatedAnswer);
    }

    @DeleteMapping("/{answerId}")
    public void deleteAnswer(@PathVariable UUID id) {
        answerService.deleteAnswer(id);
    }
}
