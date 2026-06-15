package com.wemiix.app.repository;

import com.wemiix.app.model.KaraokeSession;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface KaraokeSessionRepository extends MongoRepository<KaraokeSession, String> {

    List<KaraokeSession> findByGroupId(Long groupId);
}
