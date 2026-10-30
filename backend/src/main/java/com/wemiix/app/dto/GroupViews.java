package com.wemiix.app.dto;

import com.wemiix.app.model.Group;
import com.wemiix.app.model.GroupMember;
import com.wemiix.app.model.GroupMemberRole;
import com.wemiix.app.model.User;
import com.wemiix.app.model.UserMode;

import java.util.List;

/**
 * Formes JSON des groupes exposées au front. Elles évitent de sérialiser les entités JPA
 * (hôte, utilisateurs et leurs e-mails) et fixent le contrat : {@code code} et non {@code inviteCode}.
 */
public final class GroupViews {

    private static final String UNKNOWN_MEMBER_NAME = "Invité";

    private GroupViews() {}

    /** Groupe vu par le front. {@code members} est null quand la liste n'est pas demandée. */
    public record GroupView(Long id, String name, String code, String inviteLink, String mode, List<MemberView> members) {}

    /** Membre d'un groupe : rôle en minuscules ({@code host} ou {@code guest}), nom déjà résolu. */
    public record MemberView(Long id, String name, String role) {}

    /** Réponse à « rejoindre un groupe » : de quoi rediriger vers la page du groupe. */
    public record JoinView(Long groupId, Long memberId, String role) {}

    public static GroupView of(Group group) {
        return new GroupView(group.getId(), group.getName(), group.getInviteCode(), group.getInviteLink(),
                modeLabel(group), null);
    }

    public static GroupView of(Group group, List<GroupMember> members) {
        return new GroupView(group.getId(), group.getName(), group.getInviteCode(), group.getInviteLink(),
                modeLabel(group), members.stream().map(GroupViews::of).toList());
    }

    public static MemberView of(GroupMember member) {
        return new MemberView(member.getId(), resolveName(member), roleLabel(member.getRole()));
    }

    public static JoinView joined(GroupMember member) {
        return new JoinView(member.getGroup().getId(), member.getId(), roleLabel(member.getRole()));
    }

    private static String modeLabel(Group group) {
        return group.getMode() == UserMode.CHILD ? "children" : "adult";
    }

    private static String roleLabel(GroupMemberRole role) {
        return role == GroupMemberRole.HOST ? "host" : "guest";
    }

    private static String resolveName(GroupMember member) {
        User user = member.getUser();
        if (user != null) {
            if (user.getDisplayName() != null && !user.getDisplayName().isBlank()) {
                return user.getDisplayName();
            }
            if (user.getUsername() != null && !user.getUsername().isBlank()) {
                return user.getUsername();
            }
        }
        boolean hasGuestName = member.getGuestName() != null && !member.getGuestName().isBlank();
        return hasGuestName ? member.getGuestName() : UNKNOWN_MEMBER_NAME;
    }
}
