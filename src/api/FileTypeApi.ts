const fileTypeApiUrl: string = `${import.meta.env.VITE_API_URL}/v1/file_types`

export class FileTypeApi {
    url: string;

    constructor(url: string) {
        if (url === "") {
            url = fileTypeApiUrl;
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


    async getFileTypes(currentPage: number, pageSize: number, sort: string): Promise<Response> {
        const query: string = `?page=${currentPage}&size=${pageSize}&sort=${sort}`;
        return fetch(`${this.url}${query}`, this.createRequestOptions());
    }
}

export default new FileTypeApi(fileTypeApiUrl) as FileTypeApi;
