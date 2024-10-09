# Use the official Maven image for a build stage
FROM maven:3.8.1-openjdk-11-slim AS build
WORKDIR /app
# Copy the project files to the container
COPY src ./src
COPY pom.xml .
# Build the application
RUN mvn clean package -DskipTests

# Use OpenJDK for running the application
FROM openjdk:11-jre-slim
WORKDIR /app
# Copy the built application from the build stage
COPY --from=build /app/target/*.jar app.jar
# Expose the port the app runs on
EXPOSE 8761
# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
