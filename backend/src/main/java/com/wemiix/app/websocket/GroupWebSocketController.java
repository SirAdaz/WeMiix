package com.wemiix.app.websocket;

import com.wemiix.app.model.GroupMember;
import com.wemiix.app.service.GroupService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Map;

@Controller
public class GroupWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final GroupService groupService;

    public GroupWebSocketController(SimpMessagingTemplate messagingTemplate,
                                    GroupService groupService) {
        this.messagingTemplate = messagingTemplate;
        this.groupService = groupService;
    }

    @MessageMapping("/group/{groupId}/join")
    public void handleJoin(@DestinationVariable Long groupId,
                           @Payload JoinEventPayload payload) {
        List<GroupMember> members = groupService.getGroupMembers(groupId);
        messagingTemplate.convertAndSend(
            "/topic/group/" + groupId + "/members",
            members
        );
    }

    @MessageMapping("/group/{groupId}/event")
    public void handleEvent(@DestinationVariable Long groupId,
                            @Payload Map<String, Object> event) {
        messagingTemplate.convertAndSend(
            "/topic/group/" + groupId + "/events",
            event
        );
    }

    record JoinEventPayload(Long userId, String guestName) {}
}
