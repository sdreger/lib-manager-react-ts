import {MatchersV3, PactV3} from '@pact-foundation/pact';
import path from "path";
import {describe, expect, it} from "vitest";
import {FileTypeApi} from "@/api/FileTypeApi.ts";

const {arrayContaining, integer, string} = MatchersV3;

const provider = new PactV3({
    dir: path.resolve(process.cwd(), 'pacts'),
    consumer: 'lib-manager-react-ts',
    provider: 'lib-manager-go',
});

const EXPECTED_BODY = {
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
                body: EXPECTED_BODY,
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
