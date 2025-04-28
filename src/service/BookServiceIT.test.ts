import {MatchersV3, PactV3} from '@pact-foundation/pact';
import path from "path";
import {describe, expect, it} from "vitest";
import {BookService} from "@/service/BookService.ts";
import {datetime} from "@pact-foundation/pact/src/v3/matchers";

const {eachLike, integer, string, regex} = MatchersV3;

const provider = new PactV3({
    dir: path.resolve(process.cwd(), 'pacts'),
    consumer: 'lib-manager-react-ts',
    provider: 'lib-manager-go',
});

const EXPECTED_BODY = {
    "data": {
        "page": integer(1),
        "size": integer(1),
        "total_pages": integer(8620),
        "total_elements": integer(8620),
        "content": eachLike({
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
        }, 1)
    }
};

describe('GET /v1/books', () => {
    it('returns an HTTP 200 and a list of books', () => {
        provider
            .given('I have a list of books')
            .uponReceiving('a request for all books')
            .withRequest({
                method: 'GET',
                path: '/v1/books',
                query: {size: '1', page: '1', sort: 'updated_at,desc', query: ''},
                headers: {Accept: 'application/json'},
            })
            .willRespondWith({
                status: 200,
                headers: {'Content-Type': 'application/json'},
                body: EXPECTED_BODY,
            });

        return provider.executeTest(async (mockServer) => {
            const pageNumber = 1;
            const pageSize = 1;
            const sortBy = 'updated_at,desc';
            const bookAPI = new BookService(mockServer.url + '/v1/books');
            const query = '';
            const response = await bookAPI.getBooks(pageNumber, pageSize, sortBy, query);

            expect(response.status).eq(200);
        });
    })
})
