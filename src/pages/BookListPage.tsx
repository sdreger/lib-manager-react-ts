import {AppShell, Center, Loader, Pagination} from "@mantine/core";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {BookSearchFilters, BookSearchNavbar} from "@/components/BookSearchNavbar/BookSearchNavbar";
import {BookList, BookListItem} from "@/components/BookList/BookList";
import BookApi, {BookLookupItem, BookLookupResponse} from "@/api/BookApi.ts";
import FileTypeApi, {FileTypesResponse} from "@/api/FileTypeApi.ts";
import {handleError} from "@/errors/errors.ts";
import {ApiErrorsResponse} from "@/api/CommonApi.ts";

const bookListPageSize: number = 10;
const fileTypeListPageSize: number = 100;
const firstApiPage: number = 1;

export function BookListPage() {

    const params = useParams();
    const currentPageParam = params.page === undefined ? firstApiPage : parseInt(params.page);

    const [bookSearchFilters, setBookSearchFilters] = useState<BookSearchFilters>({
        orderBy: "updated_at,desc",
        searchTerm: "",
        publisherIds: [],
    });
    const [books, setBooks] = useState<BookLookupItem[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(currentPageParam);
    const [totalBooks, setTotalBooks] = useState<number>(0);
    const [fileTypes, setFileTypes] = useState<Map<number, string>>(new Map());
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentPage(currentPageParam);
    }, [params]);

    useEffect(() => {
        const fetchFileTypes =
            async (currentPage: number, pageSize: number, sort: string): Promise<void> => {
                try {
                    const response: Response = await FileTypeApi.getFileTypes(currentPage, pageSize, sort);
                    if (response.status >= 400) {
                        handleError("File types fetch error", await response.json() as ApiErrorsResponse)
                        return;
                    }

                    const json: FileTypesResponse = await response.json();
                    const fileTypes: Map<number, string> =
                        new Map(json.data.content.map(
                            (item: { id: number, name: string }) => [item.id, item.name]
                        ));
                    setFileTypes(fileTypes);
                } catch (err) {
                    console.error(err);
                }
            }

        void fetchFileTypes(firstApiPage, fileTypeListPageSize, "id,desc");
    }, []);

    useEffect(() => {
        const fetchBooks =
            async (currentPage: number, pageSize: number, filters: BookSearchFilters): Promise<void> => {
                const {orderBy: sort, searchTerm, publisherIds} = filters;
                try {
                    const response: Response = await BookApi.getBooks(
                        currentPage, pageSize,
                        sort, searchTerm,
                        publisherIds
                    );
                    if (response.status >= 400) {
                        handleError("Book list fetch error", await response.json() as ApiErrorsResponse)
                        return;
                    }

                    const json: BookLookupResponse = await response.json();
                    setBooks(json.data.content.map((book: BookLookupItem): BookLookupItem => {
                        book.pub_date = new Date(book.pub_date);
                        return book;
                    }));
                    // setCurrentPage(json.data.page);
                    setTotalBooks(json.data.total_pages);
                } catch (err: any) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            }

        void fetchBooks(currentPage, bookListPageSize, bookSearchFilters);
    }, [currentPage, bookSearchFilters]);

    function handleBookSearchFiltersChange(val: BookSearchFilters): void {
        setBookSearchFilters(val);
        navigate(`/`);
    }

    function handlePageChange(page: number): void {
        navigate(`/books/${page}`);
    }

    const bookList: BookListItem[] = books.map((bookLookupItem: BookLookupItem): BookListItem => {

        return {
            id: bookLookupItem.id,
            title: bookLookupItem.title,
            subTitle: bookLookupItem.subtitle,
            pages: bookLookupItem.pages,
            edition: bookLookupItem.edition,
            pubDate: bookLookupItem.pub_date,
            bookFileSize: bookLookupItem.book_file_size,
            coverFileName: bookLookupItem.cover_file_name,
            publisher: bookLookupItem.publisher,
            fileTypes: bookLookupItem.file_type_ids.reduce((result: string[], fileTypeId: number): string[] => {
                const fileTypeString: string | undefined = fileTypes.get(fileTypeId);
                if (fileTypeString) {
                    result.push(fileTypeString);
                }
                return result;
            }, []),
        };
    })

    return (
        <>
            <BookSearchNavbar onFiltersChange={handleBookSearchFiltersChange}/>
            <AppShell.Main>
                {loading ?
                    <Center my="xl"><Loader color="blue"/></Center>
                    : <>
                        <BookList books={bookList}/>
                        <Center mt="md">
                            <Pagination visibleFrom="md" boundaries={2} siblings={2} withEdges
                                        onChange={handlePageChange} total={totalBooks} value={currentPage}/>
                            <Pagination hiddenFrom="md" visibleFrom="sm" boundaries={1}
                                        onChange={handlePageChange} total={totalBooks} value={currentPage}/>
                            <Pagination hiddenFrom="sm" boundaries={1} siblings={0}
                                        onChange={handlePageChange} total={totalBooks} value={currentPage}/>
                        </Center>
                    </>
                }

            </AppShell.Main>
        </>
    );
}
