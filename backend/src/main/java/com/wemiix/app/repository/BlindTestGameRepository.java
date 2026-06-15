package com.wemiix.app.repository;

import com.wemiix.app.model.BlindTestGame;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BlindTestGameRepository extends MongoRepository<BlindTestGame, String> {

    List<BlindTestGame> findByGroupId(Long groupId);
}
