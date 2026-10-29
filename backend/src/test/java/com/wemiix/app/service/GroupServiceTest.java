package com.wemiix.app.service;

import com.wemiix.app.model.Group;
import com.wemiix.app.model.User;
import com.wemiix.app.model.UserMode;
import com.wemiix.app.repository.GroupMemberRepository;
import com.wemiix.app.repository.GroupRepository;
import com.wemiix.app.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class GroupServiceTest {

    private static final long HOST_ID = 7L;
    private static final long GROUP_ID = 3L;

    private GroupRepository groupRepository;
    private UserRepository userRepository;
    private GroupService groupService;
    private User host;

    @BeforeEach
    void setUp() {
        groupRepository = mock(GroupRepository.class);
        userRepository = mock(UserRepository.class);
        groupService = new GroupService(groupRepository, mock(GroupMemberRepository.class),
                userRepository, "http://localhost:3000");
        host = mock(User.class);
        when(host.getId()).thenReturn(HOST_ID);
    }

    @Test
    void createGroupSetsTheAuthenticatedUserAsHost() {
        when(userRepository.findById(HOST_ID)).thenReturn(Optional.of(host));
        when(groupRepository.save(any(Group.class))).thenAnswer(call -> call.getArgument(0));

        Group group = groupService.createGroup("Soiree", UserMode.ADULT, HOST_ID);

        assertSame(host, group.getHost());
        assertEquals("http://localhost:3000/join/" + group.getInviteCode(), group.getInviteLink());
    }

    @Test
    void onlyTheHostCanDeactivateTheGroup() {
        Group group = new Group();
        group.setHost(host);
        group.setActive(true);
        when(groupRepository.findById(GROUP_ID)).thenReturn(Optional.of(group));

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> groupService.deactivateGroup(GROUP_ID, 99L));

        assertEquals(HttpStatus.FORBIDDEN, error.getStatusCode());
        verify(groupRepository, never()).save(any(Group.class));
    }

    @Test
    void hostCanDeactivateTheGroup() {
        Group group = new Group();
        group.setHost(host);
        group.setActive(true);
        when(groupRepository.findById(GROUP_ID)).thenReturn(Optional.of(group));

        groupService.deactivateGroup(GROUP_ID, HOST_ID);

        verify(groupRepository).save(group);
        assertEquals(false, group.isActive());
    }
}
