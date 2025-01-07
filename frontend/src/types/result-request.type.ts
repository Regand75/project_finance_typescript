export type ResultRequestType<T = any> = {
    error: boolean,
    response: T | null,
    status?: number,
}