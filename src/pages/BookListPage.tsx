import {AppShell, Center, Loader} from "@mantine/core";
import {notifications} from '@mantine/notifications';
import {useEffect, useState} from "react";
import {BookSearchFilters, BookSearchNavbar} from "@/components/BookSearchNavbar/BookSearchNavbar";
import {BookList, BookListItem} from "@/components/BookList/BookList";

type BookLookupItem = {
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

type BookLookupResponseData = {
    page: number;
    size: number;
    total_pages: number;
    total_elements: number;
    content: BookLookupItem[]
}

type BookLookupResponse = {
    data: BookLookupResponseData
}

type ApiErrorResponse = {
    field: string;
    message: string;
}

type ApiErrorsResponse = {
    errors: ApiErrorResponse[];
}

const bookApiUrl: string = `${import.meta.env.VITE_API_URL}/v1/books`
const pageSize: number = 10;

function handleError(title: string, error: ApiErrorsResponse) {
    const message = error.errors.map((err: ApiErrorResponse): string => {
        return err.message
    }).join(",")
    console.error(message);
    showErrorNotification(title, message);
}

function showErrorNotification(title: string, message: string): void {
    notifications.show({
        color: 'red',
        message: message,
        title: title,
        position: "bottom-right",
        autoClose: 5000,
        withBorder: true
    })
}

function createRequestOptions(): RequestInit {
    const headers: Headers = new Headers();
    headers.set("Accept", "application/json");
    return {
        method: "GET",
        headers: headers,
    };
}

export function BookListPage() {
    const [bookSearchFilters, setBookSearchFilters] = useState<BookSearchFilters>({
        orderBy: "updated_at,desc",
        searchTerm: ""
    });
    const [books, setBooks] = useState<BookLookupItem[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchBooks =
            async (currentPage: number, pageSize: number, sort: string, searchTerm: string): Promise<void> => {
                const query: string = `?page=${currentPage}&size=${pageSize}&sort=${sort}&query=${searchTerm}`;
                try {
                    const response: Response = await fetch(`${bookApiUrl}${query}`, createRequestOptions());
                    if (response.status >= 400) {
                        handleError("Book list fetch error", await response.json() as ApiErrorsResponse)
                        return;
                    }

                    const json: BookLookupResponse = await response.json();
                    setBooks(json.data.content.map((book: BookLookupItem): BookLookupItem => {
                        book.pub_date = new Date(book.pub_date);
                        return book;
                    }));
                    setCurrentPage(json.data.page);
                    setLoading(false);
                } catch (err: any) {
                    console.error(err);
                }
            }
        fetchBooks(currentPage, pageSize, bookSearchFilters.orderBy, bookSearchFilters.searchTerm);
    }, [currentPage, bookSearchFilters]);

    function handleBookSearchFiltersChange(val: BookSearchFilters) {
        setBookSearchFilters(val);
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
            fileTypes: ["pdf", "epub", "mobi", "zip"], // TODO: map to real values
        };
    })

    return (
        <>
            <BookSearchNavbar onFiltersChange={handleBookSearchFiltersChange}/>
            <AppShell.Main>
                {loading ? <Center my="xl"><Loader color="blue"/></Center> : <BookList books={bookList}/>}
            </AppShell.Main>
        </>
    );
}
