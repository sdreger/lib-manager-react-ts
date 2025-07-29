import {MatchersV3, PactV3} from '@pact-foundation/pact';
import path from "path";
import {describe, expect, it} from "vitest";
import {BookApi} from "@/api/BookApi.ts";
import {arrayContaining, datetime} from "@pact-foundation/pact/src/v3/matchers";
import {FileTypeApi} from "@/api/FileTypeApi.ts";
import {PublisherApi} from "@/api/PublisherApi.ts";

const {constrainedArrayLike, eachLike, integer, string, regex} = MatchersV3;

const provider = new PactV3({
    dir: path.resolve(process.cwd(), 'pacts'),
    consumer: 'lib-manager-react-ts',
    provider: 'lib-manager-go',
});

const BOOK_LIST_EXPECTED_BODY = {
    "data": {
        "page": integer(1),
        "size": integer(1),
        "total_pages": integer(8620),
        "total_elements": integer(8620),
        "content": constrainedArrayLike({
            "id": integer(1),
            "title": string("Azure AI Services at Scale for Cloud, Mobile, and Edge"),
            "subtitle": string("Building Intelligent Apps with Azure Cognitive Services and Machine Learning"),
            "isbn10": string("1098108043"),
            "isbn13": integer(9781098108045),
            "asin": string("B01LXWQUFF"),
            "pages": integer(228),
            "edition": integer(1),
            "pub_date": datetime("yyyy-MM-dd'T'HH:mm:ssX", "2022-05-24T00:00:00Z"),
            "book_file_size": integer(55425169),
            "cover_file_name": regex("^\\w+\\.\\w{3,4}$", "1098108043.jpg"),
            "publisher": string("OReilly"),
            "language": string("English"),
            "author_ids": eachLike(integer(1), 1),
            "category_ids": eachLike(integer(1), 1),
            "file_type_ids": eachLike(integer(1), 1),
            "tag_ids": eachLike(integer(1), 0),
        }, 1, 1)
    }
};

describe('GET /v1/books', () => {
    it('returns an HTTP 200 and a list of books', () => {
        provider
            .given('I have a list of books')
            .uponReceiving('a request for a page of books')
            .withRequest({
                method: 'GET',
                path: '/v1/books',
                query: {size: '1', page: '1', sort: 'updated_at,desc', query: ''},
                headers: {Accept: 'application/json'},
            })
            .willRespondWith({
                status: 200,
                headers: {'Content-Type': 'application/json'},
                body: BOOK_LIST_EXPECTED_BODY,
            });

        return provider.executeTest(async (mockServer) => {
            const pageNumber = 1;
            const pageSize = 1;
            const sortBy = 'updated_at,desc';
            const bookAPI = new BookApi(mockServer.url + '/v1/books');
            const query = '';
            const response = await bookAPI.getBooks(pageNumber, pageSize, sortBy, query, []);

            expect(response.status).eq(200);
            // TODO: check fields
        });
    })
})

const BOOK_EXPECTED_BODY = {
    "data": {
        "id": integer(1),
        "title": string("Azure AI Services at Scale for Cloud, Mobile, and Edge"),
        "subtitle": string("Building Intelligent Apps with Azure Cognitive Services and Machine Learning"),
        "description": string("Building Intelligent Apps with Azure Cognitive Services and Machine Learning..."),
        "isbn10": string("1098108043"),
        "isbn13": integer(9781098108045),
        "asin": string("B01LXWQUFF"),
        "pages": integer(228),
        "publisher_url": string("https://www.amazon.com/dp/1098108043"),
        "edition": integer(1),
        "pub_date": datetime("yyyy-MM-dd'T'HH:mm:ssX", "2022-05-24T00:00:00Z"),
        "book_file_name": string("OReilly.Azure.AI.Services.at.Scale.for.Cloud.Mobile.and.Edge.1098108043.May.2022.zip"),
        "book_file_size": integer(55425169),
        "cover_file_name": regex("^\\w+\\.\\w{3,4}$", "1098108043.jpg"),
        "publisher": string("OReilly"),
        "language": string("English"),
        "authors": eachLike(string("Anand Raman"), 1),
        "categories": eachLike(string("Computer Science"), 1),
        "file_types": eachLike(string("pdf"), 1),
        "tags": eachLike(string(), 0),
        "created_at": datetime("yyyy-MM-dd'T'HH:mm:ss.SSSSSSX", "2022-07-23T12:13:06.476871Z"),
        "updated_at": datetime("yyyy-MM-dd'T'HH:mm:ss.SSSSSSX", "2022-07-23T12:13:06.476871Z"),
    },
};

describe('GET /v1/books/1', () => {
    const bookId = 1;
    it('returns an HTTP 200 and a book', () => {
        provider
            .given('I have a book')
            .uponReceiving('a request for a book')
            .withRequest({
                method: 'GET',
                path: `/v1/books/${bookId}`,
                headers: {Accept: 'application/json'},
            })
            .willRespondWith({
                status: 200,
                headers: {'Content-Type': 'application/json'},
                body: BOOK_EXPECTED_BODY,
            });

        return provider.executeTest(async (mockServer) => {
            const bookAPI = new BookApi(mockServer.url + '/v1/books');
            const response = await bookAPI.getBook(bookId);

            expect(response.status).eq(200);
            const json = await response.json();
            const data = json.data;
            expect(data).not.to.be.undefined;
            expect(data.id).eq(bookId);
            expect(data.title).eq(BOOK_EXPECTED_BODY.data.title.value);
            expect(data.subtitle).eq(BOOK_EXPECTED_BODY.data.subtitle.value);
            // TODO: check necessary fields
        });
    })
})

const FILE_TYPES_EXPECTED_BODY = {
    "data": {
        "page": integer(1),
        "size": integer(2),
        "total_pages": integer(2),
        "total_elements": integer(4),
        "content": arrayContaining(
            {
                "id": integer(1),
                "name": string("pdf"),
            },
            {
                "id": integer(2),
                "name": string("epub"),
            },
        )
    }
};

describe('GET /v1/file_types', () => {
    it('returns an HTTP 200 and a list of file types', () => {
        provider
            .given('I have a list of file types')
            .uponReceiving('a request for a page of file types')
            .withRequest({
                method: 'GET',
                path: '/v1/file_types',
                query: {size: '2', page: '1', sort: 'name,asc'},
                headers: {Accept: 'application/json'},
            })
            .willRespondWith({
                status: 200,
                headers: {'Content-Type': 'application/json'},
                body: FILE_TYPES_EXPECTED_BODY,
            });

        return provider.executeTest(async (mockServer) => {
            const pageNumber = 1;
            const pageSize = 2;
            const sortBy = 'name,asc';
            const fileTypeAPI = new FileTypeApi(mockServer.url + '/v1/file_types');
            const response = await fileTypeAPI.getFileTypes(pageNumber, pageSize, sortBy);

            expect(response.status).eq(200);
            // TODO: check fields
        });
    })
})

const PUBLISHER_LIST_EXPECTED_BODY = {
    "data": {
        "page": integer(1),
        "size": integer(2),
        "total_pages": integer(2),
        "total_elements": integer(4),
        "content": arrayContaining(
            {
                "id": integer(1),
                "name": string("Apress"),
            },
            {
                "id": integer(2),
                "name": string("Oreilly"),
            },
        )
    }
};

describe('GET /v1/publishers', () => {
    it('returns an HTTP 200 and a list of publishers', () => {
        provider
            .given('I have a list of publishers')
            .uponReceiving('a request for a page of publishers')
            .withRequest({
                method: 'GET',
                path: '/v1/publishers',
                query: {size: '2', page: '1', sort: 'name,asc'},
                headers: {Accept: 'application/json'},
            })
            .willRespondWith({
                status: 200,
                headers: {'Content-Type': 'application/json'},
                body: PUBLISHER_LIST_EXPECTED_BODY,
            });

        return provider.executeTest(async (mockServer) => {
            const pageNumber = 1;
            const pageSize = 2;
            const sortBy = 'name,asc';
            const publisherApi = new PublisherApi(mockServer.url + '/v1/publishers');
            const response = await publisherApi.getPublishers(pageNumber, pageSize, sortBy);

            expect(response.status).eq(200);
            // TODO: check fields
        });
    })

    describe('GET /v1/books/1/download', () => {
        const bookId = 1;
        const bookArchiveName = 'OReilly.Azure.AI.Services.at.Scale.for.Cloud.Mobile.and.Edge.1098108043.May.2022.zip';
        it('returns an HTTP 200 and a book archive', () => {
            provider
                .given('I have a book archive')
                .uponReceiving('a request for a book archive')
                .withRequest({
                    method: 'GET',
                    path: `/v1/books/${bookId}/download`,
                    headers: {Accept: 'application/octet-stream'},
                })
                .willRespondWith({
                    status: 200,
                    contentType: 'application/octet-stream',
                    headers: {
                        'Content-Disposition': regex('attachment; filename=\"\\S+\"', bookArchiveName),
                    }
                });

            return provider.executeTest(async (mockServer) => {
                const headers: Headers = new Headers();
                headers.set("Accept", 'application/octet-stream');
                const response =
                    await fetch(`${mockServer.url}/v1/books/${bookId}/download`, {
                        method: "GET",
                        headers: headers,
                    })
                expect(response.status).eq(200);
                expect(response.headers.get('Content-Disposition')).eq(bookArchiveName);
            });
        })
    })
})
