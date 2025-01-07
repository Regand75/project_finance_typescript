
export interface CategorySuccessResponse {
    id: number,
    title: string,
}

export type CategoryRequest = {
    title: string,
}

export interface CategoryErrorResponse {
    error: boolean,
    message: string,
}

export type CategoriesResponseType = CategorySuccessResponse[] | CategoryErrorResponse | false;
export type CategoryResponseType = CategorySuccessResponse | CategoryErrorResponse | false;