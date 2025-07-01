import {useParams} from "react-router";
import {AppShell} from "@mantine/core";
import {useEffect, useState} from "react";
import BookApi, {BookItem, BookItemResponse} from "@/api/BookApi.ts";
import {handleError} from "@/errors/errors.ts";
import {ApiErrorsResponse} from "@/api/CommonApi.ts";

export function BookPage() {
    const params = useParams();
    const [book, setBook] = useState<BookItem>({} as BookItem);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchBook = async (bookId: number): Promise<void> => {
            try {
                const response: Response = await BookApi.getBook(bookId);
                if (response.status >= 400) {
                    handleError("File types fetch error", await response.json() as ApiErrorsResponse)
                    return;
                }

                const json: BookItemResponse = await response.json();
                setBook(json.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        if (params.id) {
            const bookIdNumber: number = parseInt(params.id);
            void fetchBook(bookIdNumber);
        } else {
            console.error("Can not fetch a book with id: " + params.id);
        }
    }, []);

    return (
        <>
            <AppShell.Navbar p="md">
            </AppShell.Navbar>
            <AppShell.Main>
                <p>BookID: {book.id}</p>
            </AppShell.Main>
        </>
    );
}
