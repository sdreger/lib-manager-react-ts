const publisherApiUrl: string = `${import.meta.env.VITE_API_URL}/v1/publishers`


type ResponsePage<T> = {
    page: number;
    size: number;
    total_pages: number;
    total_elements: number;
    content: T[]
}

type PublisherItem = {
    id: number;
    name: string;
}

type PublisherResponse = {
    data: ResponsePage<PublisherItem>
}

export class PublisherApi {
    url: string;

    constructor(url: string) {
        if (url === "") {
            url = publisherApiUrl;
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

    async getPublishers(currentPage: number, pageSize: number, sort: string): Promise<Response> {
        const query: string = `?page=${currentPage}&size=${pageSize}&sort=${sort}`;
        return fetch(`${this.url}${query}`, this.createRequestOptions());
    }

    async getPublishersPage(currentPage: number, pageSize: number, sort: string): Promise<PublisherResponse> {
        const response: Response = await this.getPublishers(currentPage, pageSize, sort);
        if (response.status >= 400) {
            console.error(response.statusText);
            return {} as PublisherResponse;
        }
        return await response.json();
    }

    async getAllPublishers(): Promise<Map<number, string>> {
        let done = false;
        const result = new Map<number, string>();
        const sort: string = "name,asc"
        let currentPage: number = 1, pageSize: number = 50;
        while (!done) {
            const response: PublisherResponse = await this.getPublishersPage(currentPage, pageSize, sort);
            if (response.data !== null) {
                if (response.data.total_pages === currentPage) {
                    done = true;
                }
                response.data.content.forEach((p: PublisherItem) => {
                    result.set(p.id, p.name);
                })
                currentPage++;
            }
        }
        return result;
    }
}

export default new PublisherApi(publisherApiUrl) as PublisherApi;
