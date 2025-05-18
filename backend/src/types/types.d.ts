declare global {
    namespace Express {
        interface Locals {
            jwtData: import("jsonwebtoken").JwtPayload; // Import JwtPayload from jsonwebtoken
        }
    }
}
