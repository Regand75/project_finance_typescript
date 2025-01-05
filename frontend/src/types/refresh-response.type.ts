interface RefreshSuccessResponse {
    tokens: {
        accessToken: string,
        refreshToken: string,
    },
}

interface RefreshErrorResponse {
    error: true,
    message: string,
    validation?: {
        key: string,
        message: string,
    }[],
}

export type RefreshResponseType = RefreshSuccessResponse | RefreshErrorResponse;