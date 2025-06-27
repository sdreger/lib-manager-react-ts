export type ResponsePage<T> = {
    page: number;
    size: number;
    total_pages: number;
    total_elements: number;
    content: T[]
}

export type ApiErrorResponse = {
    field: string;
    message: string;
}

export type ApiErrorsResponse = {
    errors: ApiErrorResponse[];
}
