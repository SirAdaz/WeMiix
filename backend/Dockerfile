# =====================================================
# Dockerfile WeMiix Backend — Spring Boot + Java 21
# Build multi-stage : builder Maven + runtime JRE léger
# =====================================================

# --- Étape 1 : Build Maven ---
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copier le pom.xml séparément pour tirer parti du cache Docker
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Copier les sources et compiler
COPY src ./src
RUN mvn clean package -DskipTests -q

# --- Étape 2 : Runtime JRE minimal ---
FROM eclipse-temurin:21-jre-alpine AS production

WORKDIR /app

# Créer un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 spring && \
    adduser --system --uid 1001 --ingroup spring spring

# Copier uniquement le JAR compilé
COPY --from=builder --chown=spring:spring /app/target/*.jar app.jar

USER spring

EXPOSE 8080

# Options JVM optimisées pour les containers
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
