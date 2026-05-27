package com.projects.vidyara.backend.forum.repository;

import com.projects.vidyara.backend.forum.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID> {
}
