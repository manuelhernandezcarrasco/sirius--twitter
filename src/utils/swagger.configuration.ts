import swaggerJSDoc, {
    OAS3Definition,
    OAS3Options
} from "swagger-jsdoc";

const swaggerDefinition: OAS3Definition = {
    openapi: "3.0.0",
    info: {
        title: "Sirius Twitter",
        version: "1.0.0",
    },
    servers: [
        {
            url: "http://localhost:8080"
        }
    ],
    components: {
        securitySchemes: {
            auth: {
                type: "http",
                scheme: "bearer",
            },
        },
        schemas: {
            signUpInputDTO: {
                type: "object",
                required: ["email", "username", "password"],
                properties: {
                    username: {
                        type: "string",
                    },
                    email: {
                        type: "string",
                    },
                    password: {
                        type: "string",
                    },
                    private: {
                        type: "boolean",
                    },
                },
            },
            loginInputDTO: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: {
                        type: "string",
                    },
                    password: {
                        type: "string",
                    },
                },
            },
            createPostInputDTO: {
                type: "object",
                required: ["content"],
                properties: {
                    content: {
                        type: "string",
                    },
                    images: {
                        type: ["string"],
                    },
                },
            },
        },
    },
};


export const swaggerOptions: OAS3Options = {
    swaggerDefinition,
    apis: [
        'src/domains/auth/controller/auth.controller.ts',
        'src/domains/follower/controller/follower.controller.ts',
        'src/domains/health/controller/health.controller.ts',
        'src/domains/post/controller/post.controller.ts',
        'src/domains/user/controller/user.controller.ts',
    ],
} 
  