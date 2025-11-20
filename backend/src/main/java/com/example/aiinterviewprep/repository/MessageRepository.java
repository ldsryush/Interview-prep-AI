package com.example.aiinterviewprep.repository;

import com.example.aiinterviewprep.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // Find all messages for a specific session, ordered by creation time
    List<Message> findBySessionIdOrderByCreatedAtAsc(Long sessionId);

    // Find all messages for a session
    List<Message> findBySessionId(Long sessionId);
}