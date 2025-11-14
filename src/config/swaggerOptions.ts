import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Loan Monitoring API",
            version: "1.0.0",
            description:
                "API documentation for the Loan Monitoring application. This API provides endpoints for managing loan applications with role-based access control (user, officer, manager) and user administration.",
            contact: {
                name: "API Support",
                email: "support@loanmonitoring.com",
            },
        },
        servers: [
            {
                url: process.env.SWAGGER_SERVER_URL || "http://localhost:3000/api/v1",
                description: "API Server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your Firebase JWT token",
                },
            },
            schemas: {
                Loan: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "Unique loan identifier",
                            example: "loan123abc",
                        },
                        userId: {
                            type: "string",
                            description: "ID of the user who created the loan",
                            example: "user456def",
                        },
                        amount: {
                            type: "number",
                            description: "Loan amount requested",
                            example: 50000,
                            minimum: 0,
                        },
                        purpose: {
                            type: "string",
                            description: "Purpose of the loan",
                            example: "Home renovation",
                        },
                        status: {
                            type: "string",
                            enum: ["pending", "under_review", "approved", "rejected"],
                            description: "Current status of the loan application",
                            example: "pending",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            description: "Timestamp when the loan was created",
                            example: "2024-01-15T10:30:00Z",
                        },
                        reviewedBy: {
                            type: "string",
                            description: "ID of the officer who reviewed the loan",
                            example: "officer789ghi",
                        },
                        approvedBy: {
                            type: "string",
                            description: "ID of the manager who approved/rejected the loan",
                            example: "manager012jkl",
                        },
                    },
                },
                CreateLoanRequest: {
                    type: "object",
                    required: ["amount", "purpose"],
                    properties: {
                        amount: {
                            type: "number",
                            description: "Loan amount requested",
                            example: 50000,
                            minimum: 0,
                        },
                        purpose: {
                            type: "string",
                            description: "Purpose of the loan",
                            example: "Home renovation",
                            minLength: 1,
                        },
                    },
                },
                ReviewLoanRequest: {
                    type: "object",
                    required: ["notes"],
                    properties: {
                        notes: {
                            type: "string",
                            description: "Review notes from the loan officer",
                            example: "Documents verified, customer has good credit history",
                        },
                    },
                },
                ApproveLoanRequest: {
                    type: "object",
                    required: ["approved"],
                    properties: {
                        approved: {
                            type: "boolean",
                            description: "Whether the loan is approved or rejected",
                            example: true,
                        },
                    },
                },
                User: {
                    type: "object",
                    properties: {
                        uid: {
                            type: "string",
                            description: "Unique user identifier",
                            example: "user123abc",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            description: "User email address",
                            example: "user@example.com",
                        },
                        role: {
                            type: "string",
                            enum: ["user", "officer", "manager"],
                            description: "User role for authorization",
                            example: "user",
                        },
                        customClaims: {
                            type: "object",
                            description: "Custom claims associated with the user",
                            additionalProperties: true,
                        },
                        metadata: {
                            type: "object",
                            properties: {
                                creationTime: {
                                    type: "string",
                                    format: "date-time",
                                },
                                lastSignInTime: {
                                    type: "string",
                                    format: "date-time",
                                },
                            },
                        },
                    },
                },
                SetUserClaimsRequest: {
                    type: "object",
                    required: ["role"],
                    properties: {
                        role: {
                            type: "string",
                            enum: ["user", "officer", "manager"],
                            description: "Role to assign to the user",
                            example: "officer",
                        },
                        customClaims: {
                            type: "object",
                            description: "Additional custom claims to set",
                            additionalProperties: true,
                        },
                    },
                },
                SuccessResponse: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "Success message",
                            example: "Operation completed successfully",
                        },
                        data: {
                            type: "object",
                            description: "Response data",
                        },
                    },
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        error: {
                            type: "string",
                            description: "Error message",
                            example: "Resource not found",
                        },
                        code: {
                            type: "string",
                            description: "Error code",
                            example: "NOT_FOUND",
                        },
                        status: {
                            type: "string",
                            example: "error",
                        },
                    },
                },
            },
            responses: {
                UnauthorizedError: {
                    description: "Authentication token is missing or invalid",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            example: {
                                error: "Unauthorized",
                                code: "UNAUTHORIZED",
                                status: "error",
                            },
                        },
                    },
                },
                ForbiddenError: {
                    description: "User does not have permission to access this resource",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            example: {
                                error: "Forbidden - Insufficient permissions",
                                code: "FORBIDDEN",
                                status: "error",
                            },
                        },
                    },
                },
                NotFoundError: {
                    description: "The requested resource was not found",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            example: {
                                error: "Resource not found",
                                code: "NOT_FOUND",
                                status: "error",
                            },
                        },
                    },
                },
                BadRequestError: {
                    description: "Invalid request parameters or body",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            example: {
                                error: "Invalid request data",
                                code: "BAD_REQUEST",
                                status: "error",
                            },
                        },
                    },
                },
                InternalServerError: {
                    description: "Internal server error",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                            example: {
                                error: "Internal server error",
                                code: "INTERNAL_ERROR",
                                status: "error",
                            },
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        tags: [
            {
                name: "Loans",
                description: "Loan application management endpoints",
            },
            {
                name: "Admin",
                description: "User administration and management endpoints",
            },
            {
                name: "Health",
                description: "Application health check endpoints",
            },
        ],
    },
    apis: ["./src/api/v1/routes/*.ts", "./src/app.ts"], // Path to the API docs and schemas
};

// Generate the Swagger spec
export const generateSwaggerSpec = (): object => {
    return swaggerJsdoc(swaggerOptions);
};