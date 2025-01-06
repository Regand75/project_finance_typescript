export interface CategoriesSuccessResponse {
    id: number,
    title: string,
}

export type CategoryResponse = {
    title: string,
}

export interface CategoriesErrorResponse {
    error: boolean,
    message: string,
}

export type CategoriesResponseType = CategoriesSuccessResponse[] | CategoriesErrorResponse | false;
export type CategoryResponseType = CategoriesSuccessResponse | CategoriesErrorResponse | false;