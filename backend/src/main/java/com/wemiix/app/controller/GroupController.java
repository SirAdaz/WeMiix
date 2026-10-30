package com.wemiix.app.controller;

import com.wemiix.app.dto.GroupViews;
import com.wemiix.app.dto.GroupViews.GroupView;
import com.wemiix.app.dto.GroupViews.JoinView;
import com.wemiix.app.dto.GroupViews.MemberView;
import com.wemiix.app.model.Group;
import com.wemiix.app.model.GroupMember;
import com.wemiix.app.model.UserMode;
import com.wemiix.app.service.GroupService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    /** L'hôte est l'utilisateur authentifié par le JWT, jamais une valeur du corps de la requête. */
    @PostMapping
    public ResponseEntity<GroupView> createGroup(@RequestBody CreateGroupRequest request, Authentication authentication) {
        UserMode mode = parseMode(request.mode());
        Group group = groupService.createGroup(request.name(), mode, currentUserId(authentication));
        return ResponseEntity.status(HttpStatus.CREATED).body(GroupViews.of(group));
    }

    @PostMapping("/{inviteCode}/join")
    public ResponseEntity<JoinView> joinGroup(
            @PathVariable String inviteCode,
            @RequestBody(required = false) JoinGroupRequest request,
            Authentication authentication) {
        GroupMember member = groupService.joinGroup(inviteCode, currentUserId(authentication), null);
        return ResponseEntity.status(HttpStatus.CREATED).body(GroupViews.joined(member));
    }

    @GetMapping("/{inviteCode}")
    public ResponseEntity<GroupView> getGroup(@PathVariable String inviteCode) {
        Group group = groupService.getGroupByInviteCode(inviteCode);
        return ResponseEntity.ok(GroupViews.of(group));
    }

    /** Page d'un groupe : groupe et membres, réservés aux membres. */
    @GetMapping("/{groupId}/overview")
    public ResponseEntity<GroupView> getGroupOverview(@PathVariable Long groupId, Authentication authentication) {
        Group group = groupService.getGroupForMember(groupId, currentUserId(authentication));
        return ResponseEntity.ok(GroupViews.of(group, groupService.getGroupMembers(groupId)));
    }

    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<MemberView>> getGroupMembers(@PathVariable Long groupId, Authentication authentication) {
        groupService.getGroupForMember(groupId, currentUserId(authentication));
        return ResponseEntity.ok(groupService.getGroupMembers(groupId).stream().map(GroupViews::of).toList());
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity<Map<String, String>> deactivateGroup(@PathVariable Long groupId, Authentication authentication) {
        groupService.deactivateGroup(groupId, currentUserId(authentication));
        return ResponseEntity.ok(Map.of("status", "deactivated", "groupId", groupId.toString()));
    }

    private Long currentUserId(Authentication authentication) {
        return (Long) authentication.getPrincipal();
    }

    private UserMode parseMode(String mode) {
        if (mode == null) {
            return UserMode.ADULT;
        }
        return switch (mode.toUpperCase()) {
            case "CHILD", "CHILDREN" -> UserMode.CHILD;
            case "ADULT" -> UserMode.ADULT;
            default -> UserMode.ADULT;
        };
    }

    record CreateGroupRequest(String name, String mode) {}

    record JoinGroupRequest(String guestName) {}
}
