package com.wemiix.app.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wemiix.app.model.User;
import com.wemiix.app.repository.UserRepository;
import com.wemiix.app.service.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Contrat JSON des groupes tel que le front le lit, avec de vrais JWT et la base H2 de test. */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class GroupControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void hostCreatesJoinsAndReadsTheGroupWithTheFrontContract() throws Exception {
        String hostToken = tokenForNewUser("Hote");
        String guestToken = tokenForNewUser("Invite");

        JsonNode created = json(mockMvc.perform(post("/api/groups")
                        .header("Authorization", "Bearer " + hostToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Soiree\",\"mode\":\"children\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString());
        assertEquals(6, created.get("code").asText().length());
        assertEquals("children", created.get("mode").asText());
        assertFalse(created.has("host"), "l'hote (et son e-mail) ne doit pas etre expose");

        JsonNode joined = json(mockMvc.perform(post("/api/groups/" + created.get("code").asText() + "/join")
                        .header("Authorization", "Bearer " + guestToken))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString());
        assertEquals(created.get("id").asLong(), joined.get("groupId").asLong());
        assertEquals("guest", joined.get("role").asText());

        mockMvc.perform(post("/api/groups/" + created.get("code").asText() + "/join")
                        .header("Authorization", "Bearer " + guestToken))
                .andExpect(status().isCreated());

        JsonNode overview = json(mockMvc.perform(get("/api/groups/" + created.get("id").asLong() + "/overview")
                        .header("Authorization", "Bearer " + guestToken))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString());
        assertEquals(2, overview.get("members").size());
        assertEquals("host", overview.get("members").get(0).get("role").asText());
        assertFalse(overview.toString().contains("@"), "aucun e-mail dans la reponse");
    }

    @Test
    void strangerCannotReadTheGroupOverview() throws Exception {
        String hostToken = tokenForNewUser("Hote");
        String strangerToken = tokenForNewUser("Inconnu");
        JsonNode created = json(mockMvc.perform(post("/api/groups")
                        .header("Authorization", "Bearer " + hostToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Prive\",\"mode\":\"adult\"}"))
                .andReturn().getResponse().getContentAsString());

        mockMvc.perform(get("/api/groups/" + created.get("id").asLong() + "/overview")
                        .header("Authorization", "Bearer " + strangerToken))
                .andExpect(status().isForbidden());
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

    private JsonNode json(String body) throws Exception {
        return objectMapper.readTree(body);
    }
}
