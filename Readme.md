# E-commerce Microservices Backend - Last Release

## Use Case

This project aims to develop a backend for a web application of an e-commerce company using a **Microservices Architecture**. The design should be extendable to accommodate further operations in future releases.

### Features (Last Release)
1. **Admin Functionality**:
   - Add or remove new products from the inventory.
   - Add or remove product details like size, price, and design.
2. **Product Service**:
   - Fetch details about products (size, price, design) from external services (such as Price Service or Product Detail Service).
3. **User Functionality**:
   - View all products on any page.
4. **Additional Feature**:
   - Add-to-cart and checkout functionalities are optional and provide additional credit if implemented.

## Cross-Cutting Concerns
These concerns should be addressed across all services:
1. **Logging**: Implement centralized logging to trace requests, exceptions, and service communication.
2. **Exception Handling**: Include proper error handling to ensure a smooth user experience.
3. **Scalability**: Services should be scalable to handle varying loads.
4. **Security**: Secure API endpoints using appropriate authentication mechanisms.

## Tools/Technologies
1. **Language**: JS for services, Java for Eureka Service Discovery and .NET for Ocelot API Gateway.
2. **Service Discovery**: 
   - Java: Using **Eureka** for service discovery.
3. **API Gateway**: 
   - .NET 6: Using **Ocelot**.
4. **Docker**: Using Docker as the deployment tool for containerizing services.
5. **Load Balancer**: Integrating a load balancer to distribute incoming traffic across services.
6. **Authentication**: 
   - Implementing a Token-based authentication mechanism.

## Deliverables
1. **Microservices Design**: A write-up identifying microservices for the above use case along with reasonable explanations.
2. **API Definitions**:
   - URL definitions of the scenarios.
   - Provide a sample **POSTMAN collection** or **request/response JSONs**.
3. **Docker Images**:
   - Build Docker images using Dockerfile available inside each service, service Discovery and API Gateway folder.
4. **Source Code**: Include the source code for all microservices.


---

## Assumptions
- The project uses in-memory data structures for simplicity in this version.
- Communication between services is assumed to use synchronous REST-based communication, but can be extended to message-based in future versions.

---

## Getting Started
To run this project, first change the mongodb url to your url and then follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Knucklehead27/Microservice.git
2. **Run Each service**:
   ```cmd
   node index.js
3. **Run Service Discovery**
   Open Service Registery Folder in VS code and build and run
4. **Run API Gateway**
   Open APIGateway Folder in Visual studio and build and run

