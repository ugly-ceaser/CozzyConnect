import { Injectable } from "@nestjs/common";

@Injectable()
export class ErrorResponse extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;

        // Ensure stack trace is captured for the error
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ErrorResponse);
        }
    }
}
