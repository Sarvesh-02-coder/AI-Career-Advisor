import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AI Career Advisor API",
      version: "1.0.0",
      description: "Career Recommendation Engine Documentation"
    }
  },
  apis: ["./index.js"], // <= Make sure this matches your file location
};

export const swaggerSpec = swaggerJsdoc(options);
export const swaggerUiMiddleware = swaggerUi;
