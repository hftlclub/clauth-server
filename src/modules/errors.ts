export class CredentialsMissingError extends Error {
    status = 400;
    constructor() {
        super('Username or password missing');
    }
}

export class CredentialsWrongError extends Error {
    status = 400;
    constructor() {
        super('Username or password incorrect');
    }
}

export class RequestBodyError extends SyntaxError {
    status = 400;
    constructor() {
        super('Error reading request body');
    }
}