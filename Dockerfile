# Use a base image with JDK 17 already installed
FROM eclipse-temurin:17-jdk

# Set the working directory
WORKDIR /app

# Copy Maven wrapper and config first (better caching)
COPY mvnw pom.xml ./
COPY .mvn .mvn

# Make the wrapper executable
RUN chmod +x mvnw

# Download dependencies (caches them)
RUN ./mvnw dependency:go-offline

# Copy the project files
COPY src ./src

# Build the app
RUN ./mvnw clean package -DskipTests

# Run the app
CMD ["java", "-jar", "target/*.jar"]
