interface TokenSuccessResponse {
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}

interface TokenErrorResponse {
    error: true;
    message: string;
    validation?: {
        key: string;
        message: string;
    }[];
}

export type TokenResponse = TokenSuccessResponse | TokenErrorResponse;