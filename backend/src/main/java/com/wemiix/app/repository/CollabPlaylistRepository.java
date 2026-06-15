package com.wemiix.app.repository;

import com.wemiix.app.model.CollabPlaylist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CollabPlaylistRepository extends JpaRepository<CollabPlaylist, Long> {

    List<CollabPlaylist> findByGroupId(Long groupId);
}
