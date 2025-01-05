interface LoginSuccessResponse {
    tokens: {
        accessToken: string,
        refreshToken: string,
    },
    user: {
        name: string,
        lastName: string,
        id: number,
    },
}

interface LoginErrorResponse {
    error: true,
    message: string,
    validation?: {
        key: string,
        message: string,
    }[],
}

export type LoginResponseType = LoginSuccessResponse | LoginErrorResponse;

interface SignupSuccessResponse {
    user: {
        id: number,
        email: string,
        name: string,
        lastName: string,
    },
}

interface SignupErrorResponse {
    error: true,
    message: string,
    validation?: {
        key: string,
        message: string,
    }[],
}

export type SignupResponseType = SignupSuccessResponse | SignupErrorResponse;