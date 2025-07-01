import {ResponsePage} from "@/api/CommonApi.ts";

const bookApiUrl: string = `${import.meta.env.VITE_API_URL}/v1/books`

export type BookLookupItem = {
    id: number;
    title: string;
    subtitle: string;
    isbn10: string;
    isbn13: number;
    asin: string;
    pages: number;
    edition: number;
    pub_date: Date;
    book_file_size: number;
    cover_file_name: string;
    publisher: string;
    language: string;
    author_ids: number[];
    category_ids: number[];
    file_type_ids: number[];
    tag_ids: number[];
}

export type BookLookupResponse = {
    data: ResponsePage<BookLookupItem>
}

export type BookItem = {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    isbn10: string;
    isbn13: number;
    asin: string;
    pages: number;
    publisher_url: string;
    edition: number;
    pub_date: Date;
    book_file_name: string;
    book_file_size: number;
    cover_file_name: string;
    language: string;
    publisher: string;
    authors: string[];
    categories: string[];
    file_types: string[];
    tags: string[];
    created_at: Date;
    updated_at: Date;
}

export type BookItemResponse = {
    data: BookItem
}

export class BookApi {
    url: string;

    constructor(url: string) {
        if (url === "") {
            url = bookApiUrl;
        }
        if (url.endsWith("/")) {
            url = url.substr(0, url.length - 1)
        }
        this.url = url
    }

    createRequestOptions(): RequestInit {
        const headers: Headers = new Headers();
        headers.set("Accept", "application/json");
        return {
            method: "GET",
            headers: headers,
        };
    }


    async getBooks(currentPage: number, pageSize: number, sort: string, searchTerm: string,
                   publisherIds: string[]): Promise<Response> {
        let query: string = `?page=${currentPage}&size=${pageSize}&sort=${sort}&query=${searchTerm}`;
        if (publisherIds.length > 0) {
            publisherIds.forEach((id: string) => {
                query += `&publisher=${id}`
            })
        }
        return fetch(`${this.url}${query}`, this.createRequestOptions());
    }

    async getBook(bookId: number): Promise<Response> {
        return fetch(`${this.url}/${bookId}`, this.createRequestOptions());
    }
}

export default new BookApi(bookApiUrl) as BookApi;
