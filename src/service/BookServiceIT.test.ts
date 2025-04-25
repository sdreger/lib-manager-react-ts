import {PactV3, MatchersV3} from '@pact-foundation/pact';
import path from "path";
import {describe, expect, it} from "vitest";
import {BookService} from "@/service/BookService.ts";

const provider = new PactV3({
    dir: path.resolve(process.cwd(), 'pacts'),
    consumer: 'lib-manager-react-ts',
    provider: 'lib-manager-go',
});

const booksResponse = {
    "data": {
        "page": 1,
        "size": 1,
        "total_pages": 8619,
        "total_elements": 8619,
        "content": [{
            "id": 1,
            "title": "Azure AI Services at Scale for Cloud, Mobile, and Edge",
            "subtitle": "Building Intelligent Apps with Azure Cognitive Services and Machine Learning",
            "isbn10": "1098108043",
            "isbn13": 9781098108045,
            "asin": "",
            "pages": 228,
            "edition": 1,
            "pub_date": "2022-05-24T00:00:00Z",
            "book_file_size": 55425169,
            "cover_file_name": "1098108043.jpg",
            "publisher": "OReilly",
            "language": "English",
            "author_ids": [1, 2, 3, 4],
            "category_ids": [1, 2],
            "file_type_ids": [1, 2],
            "tag_ids": []
        }]
    }
};

const EXPECTED_BODY = MatchersV3.eachLike(booksResponse);

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
