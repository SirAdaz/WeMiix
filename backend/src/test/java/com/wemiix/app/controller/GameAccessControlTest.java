package com.wemiix.app.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wemiix.app.model.BlindTestGame;
import com.wemiix.app.model.KaraokeSession;
import com.wemiix.app.model.User;
import com.wemiix.app.repository.BlindTestGameRepository;
import com.wemiix.app.repository.KaraokeSessionRepository;
import com.wemiix.app.repository.UserRepository;
import com.wemiix.app.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Contrôle d'accès des jeux : seul un membre du groupe agit, et son identité vient du JWT.
 * Mongo est simulé (karaoké, blind test) ; les playlists passent par la base H2 de test.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class GameAccessControlTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private ObjectMapper objectMapper;
    @MockitoBean
    private KaraokeSessionRepository karaokeRepository;
    @MockitoBean
    private BlindTestGameRepository blindTestRepository;

    private String hostToken;
    private String guestToken;
    private String strangerToken;
    private long groupId;
    private long guestMemberId;

    @BeforeEach
    void setUp() throws Exception {
        hostToken = tokenForNewUser("Hote");
        guestToken = tokenForNewUser("Invite");
        strangerToken = tokenForNewUser("Inconnu");
        JsonNode group = json(send(post("/api/groups").contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Soiree\",\"mode\":\"adult\"}"), hostToken).andReturn());
        groupId = group.get("id").asLong();
        guestMemberId = json(send(post("/api/groups/" + group.get("code").asText() + "/join"), guestToken)
                .andReturn()).get("memberId").asLong();
    }

    @Test
    void playlistIsReservedToGroupMembersAndIdentityComesFromTheToken() throws Exception {
        String createBody = "{\"groupId\":" + groupId + ",\"name\":\"Mix\"}";
        send(post("/api/playlists/").contentType(MediaType.APPLICATION_JSON).content(createBody), strangerToken)
                .andExpect(status().isForbidden());
        long playlistId = json(send(post("/api/playlists/").contentType(MediaType.APPLICATION_JSON)
                .content(createBody), hostToken).andExpect(status().isCreated()).andReturn()).get("id").asLong();

        send(get("/api/playlists/" + playlistId + "/tracks"), strangerToken).andExpect(status().isForbidden());

        String trackBody = "{\"trackId\":\"t1\",\"trackName\":\"Titre\",\"artistName\":\"Artiste\",\"memberId\":99999}";
        send(post("/api/playlists/" + playlistId + "/tracks").contentType(MediaType.APPLICATION_JSON).content(trackBody),
                strangerToken).andExpect(status().isForbidden());
        JsonNode track = json(send(post("/api/playlists/" + playlistId + "/tracks")
                .contentType(MediaType.APPLICATION_JSON).content(trackBody), guestToken)
                .andExpect(status().isCreated()).andReturn());
        assertEquals(guestMemberId, track.get("addedByMemberId").asLong(), "le memberId du corps est ignore");
        long trackId = track.get("id").asLong();

        send(post("/api/playlists/tracks/" + trackId + "/vote").contentType(MediaType.APPLICATION_JSON)
                .content("{\"value\":1}"), strangerToken).andExpect(status().isForbidden());
        send(post("/api/playlists/tracks/" + trackId + "/vote").contentType(MediaType.APPLICATION_JSON)
                .content("{\"value\":1}"), hostToken).andExpect(status().isOk()).andExpect(jsonPath("$.score").value(1));

        send(delete("/api/playlists/tracks/" + trackId), strangerToken).andExpect(status().isForbidden());
        send(delete("/api/playlists/tracks/" + trackId), hostToken).andExpect(status().isNoContent());
    }

    @Test
    void onlyTheAuthorOrTheHostCanRemoveATrack() throws Exception {
        long playlistId = json(send(post("/api/playlists/").contentType(MediaType.APPLICATION_JSON)
                .content("{\"groupId\":" + groupId + ",\"name\":\"Mix\"}"), hostToken).andReturn()).get("id").asLong();
        long trackId = json(send(post("/api/playlists/" + playlistId + "/tracks")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"trackId\":\"t2\",\"trackName\":\"B\",\"artistName\":\"C\"}"), hostToken)
                .andReturn()).get("id").asLong();

        send(delete("/api/playlists/tracks/" + trackId), guestToken).andExpect(status().isForbidden());
    }

    @Test
    void karaokeSessionIsReservedToGroupMembers() throws Exception {
        KaraokeSession session = new KaraokeSession();
        session.setId("k1");
        session.setGroupId(groupId);
        session.setStatus(KaraokeSession.Status.PLAYING);
        when(karaokeRepository.findById("k1")).thenReturn(Optional.of(session));
        when(karaokeRepository.save(any(KaraokeSession.class))).thenAnswer(call -> call.getArgument(0));

        send(get("/api/karaoke/sessions/k1"), strangerToken).andExpect(status().isForbidden());
        send(get("/api/karaoke/sessions/k1"), guestToken).andExpect(status().isOk());

        send(post("/api/karaoke/sessions/k1/vote").contentType(MediaType.APPLICATION_JSON)
                .content("{\"voterId\":\"triche\",\"candidateId\":\"424242\"}"), guestToken)
                .andExpect(status().isBadRequest());
        send(post("/api/karaoke/sessions/k1/vote").contentType(MediaType.APPLICATION_JSON)
                .content("{\"voterId\":\"triche\",\"candidateId\":\"" + guestMemberId + "\"}"), guestToken)
                .andExpect(status().isOk());
        assertEquals(String.valueOf(guestMemberId), session.getVotes().keySet().iterator().next(),
                "le votant est le membre du jeton, pas le voterId du corps");
    }

    @Test
    void blindTestGameIsReservedToGroupMembers() throws Exception {
        BlindTestGame game = new BlindTestGame();
        game.setId("g1");
        game.setGroupId(groupId);
        game.setStatus(BlindTestGame.Status.LOBBY);
        when(blindTestRepository.findById("g1")).thenReturn(Optional.of(game));
        when(blindTestRepository.save(any(BlindTestGame.class))).thenAnswer(call -> call.getArgument(0));

        send(get("/api/blindtest/games/g1"), strangerToken).andExpect(status().isForbidden());
        send(get("/api/blindtest/games/g1"), hostToken).andExpect(status().isOk());
        send(post("/api/blindtest/games/g1/next"), strangerToken).andExpect(status().isForbidden());
        send(post("/api/blindtest/games/g1/end"), strangerToken).andExpect(status().isForbidden());
        send(post("/api/blindtest/games").contentType(MediaType.APPLICATION_JSON)
                .content("{\"groupId\":" + groupId + "}"), strangerToken).andExpect(status().isForbidden());
    }

    private ResultActions send(org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder request,
                               String token) throws Exception {
        return mockMvc.perform(request.header("Authorization", "Bearer " + token));
    }

    private String tokenForNewUser(String username) {
        String unique = username + UUID.randomUUID().toString().substring(0, 8);
        User user = new User();
        user.setEmail(unique + "@example.test");
        user.setUsername(unique);
        user.setDisplayName(unique);
        User saved = userRepository.save(user);
        return jwtService.generateToken(saved.getId(), saved.getEmail());
    }

    private JsonNode json(org.springframework.test.web.servlet.MvcResult result) throws Exception {
        return objectMapper.readTree(result.getResponse().getContentAsString());
    }
}
