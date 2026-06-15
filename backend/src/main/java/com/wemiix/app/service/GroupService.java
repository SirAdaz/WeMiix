package com.wemiix.app.service;

import com.wemiix.app.model.Group;
import com.wemiix.app.model.GroupMember;
import com.wemiix.app.model.GroupMemberRole;
import com.wemiix.app.model.User;
import com.wemiix.app.model.UserMode;
import com.wemiix.app.repository.GroupMemberRepository;
import com.wemiix.app.repository.GroupRepository;
import com.wemiix.app.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.util.List;

@Service
@Transactional
public class GroupService {

    private static final String ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int INVITE_CODE_LENGTH = 6;
    private static final String JOIN_BASE_URL = "http://localhost:3000/join/";

    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    public GroupService(GroupRepository groupRepository,
                        GroupMemberRepository groupMemberRepository,
                        UserRepository userRepository) {
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.userRepository = userRepository;
    }

    public Group createGroup(String name, UserMode mode, Long userId) {
        String inviteCode = generateUniqueInviteCode();
        String inviteLink = JOIN_BASE_URL + inviteCode;

        Group group = new Group();
        group.setName(name);
        group.setInviteCode(inviteCode);
        group.setInviteLink(inviteLink);
        group.setQrCodeData(inviteLink);
        group.setMode(mode != null ? mode : UserMode.ADULT);
        group.setActive(true);

        if (userId != null) {
            User host = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable : " + userId));
            group.setHost(host);
        }

        Group saved = groupRepository.save(group);

        GroupMember hostMember = new GroupMember();
        hostMember.setGroup(saved);
        hostMember.setRole(GroupMemberRole.HOST);
        if (userId != null) {
            hostMember.setUser(group.getHost());
        }
        groupMemberRepository.save(hostMember);

        return saved;
    }

    public GroupMember joinGroup(String inviteCode, Long userId, String guestName) {
        Group group = groupRepository.findByInviteCode(inviteCode)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Groupe introuvable pour le code : " + inviteCode));

        if (!group.isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ce groupe n'est plus actif");
        }

        if (userId != null) {
            groupMemberRepository.findByGroupIdAndUserId(group.getId(), userId).ifPresent(existing -> {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'utilisateur est déjà membre de ce groupe");
            });
        }

        GroupMember member = new GroupMember();
        member.setGroup(group);
        member.setRole(GroupMemberRole.MEMBER);

        if (userId != null) {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable : " + userId));
            member.setUser(user);
        } else {
            member.setGuestName(guestName);
        }

        return groupMemberRepository.save(member);
    }

    @Transactional(readOnly = true)
    public List<GroupMember> getGroupMembers(Long groupId) {
        if (!groupRepository.existsById(groupId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Groupe introuvable : " + groupId);
        }
        return groupMemberRepository.findByGroupId(groupId);
    }

    @Transactional(readOnly = true)
    public Group getGroupByInviteCode(String inviteCode) {
        return groupRepository.findByInviteCode(inviteCode)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Groupe introuvable pour le code : " + inviteCode));
    }

    public void deactivateGroup(Long groupId) {
        Group group = groupRepository.findById(groupId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Groupe introuvable : " + groupId));
        group.setActive(false);
        groupRepository.save(group);
    }

    private String generateUniqueInviteCode() {
        String code;
        do {
            code = generateRandomCode();
        } while (groupRepository.findByInviteCode(code).isPresent());
        return code;
    }

    private String generateRandomCode() {
        StringBuilder sb = new StringBuilder(INVITE_CODE_LENGTH);
        for (int i = 0; i < INVITE_CODE_LENGTH; i++) {
            sb.append(ALPHANUMERIC.charAt(secureRandom.nextInt(ALPHANUMERIC.length())));
        }
        return sb.toString();
    }
}
