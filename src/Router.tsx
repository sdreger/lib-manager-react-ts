import { createBrowserRouter, RouterProvider } from 'react-router';
import { BookListPage } from './pages/BookListPage.tsx';
import {BookPage} from "@/pages/Book.page.tsx";
import {Root} from "@/pages/Root.tsx";

const router = createBrowserRouter([
    {
        Component: Root,
        children: [
            {index: true, Component: BookListPage},
            {index: true, path: '/books', Component: BookListPage},
            {index: true, path: '/books/:page', Component: BookListPage},
            {path: '/book/:id', Component: BookPage}
        ],
    },
]);

export function Router() {
    return <RouterProvider router={router} />;
}
