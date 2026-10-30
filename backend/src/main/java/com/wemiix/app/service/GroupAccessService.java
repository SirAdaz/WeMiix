package com.wemiix.app.service;

import com.wemiix.app.model.GroupMember;
import com.wemiix.app.model.GroupMemberRole;
import com.wemiix.app.repository.GroupMemberRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * Contrôle d'appartenance aux groupes. Les jeux (playlist, karaoké, blind test) en dépendent :
 * l'identité d'un joueur est son membre de groupe, déduit du JWT, jamais une valeur du corps de la requête.
 */
@Service
@Transactional(readOnly = true)
public class GroupAccessService {

    private final GroupMemberRepository groupMemberRepository;

    public GroupAccessService(GroupMemberRepository groupMemberRepository) {
        this.groupMemberRepository = groupMemberRepository;
    }

    /** Le membre du groupe correspondant à l'utilisateur authentifié, sinon 403. */
    public GroupMember requireMember(Long groupId, Long userId) {
        if (groupId == null || userId == null) {
            throw notMember();
        }
        return groupMemberRepository.findByGroupIdAndUserId(groupId, userId).orElseThrow(GroupAccessService::notMember);
    }

    /** Vérifie qu'un identifiant de membre (reçu en texte) appartient bien au groupe, sinon 400. */
    public GroupMember requireMemberOfGroup(Long groupId, String memberId) {
        try {
            return groupMemberRepository.findById(Long.parseLong(memberId))
                .filter(member -> member.getGroup().getId().equals(groupId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ce membre ne fait pas partie du groupe"));
        } catch (NumberFormatException invalidId) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Identifiant de membre invalide");
        }
    }

    public boolean isHost(GroupMember member) {
        return member.getRole() == GroupMemberRole.HOST;
    }

    private static ResponseStatusException notMember() {
        return new ResponseStatusException(HttpStatus.FORBIDDEN, "Tu ne fais pas partie de ce groupe");
    }
}
