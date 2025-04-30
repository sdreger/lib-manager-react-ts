const bookApiUrl: string = `${import.meta.env.VITE_API_URL}/v1/books`

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


    async getBooks(currentPage: number, pageSize: number, sort: string, searchTerm: string): Promise<Response> {
        const query: string = `?page=${currentPage}&size=${pageSize}&sort=${sort}&query=${searchTerm}`;
        return fetch(`${this.url}${query}`, this.createRequestOptions());
    }
}

export default new BookApi(bookApiUrl);
