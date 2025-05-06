import { createBrowserRouter, RouterProvider } from 'react-router';
import { BookListPage } from './pages/BookListPage.tsx';
import {Root} from "@/pages/Root.tsx";

const router = createBrowserRouter([
    {
        Component: Root,
        children: [
            {index: true, Component: BookListPage},
            {index: true, path: '/books', Component: BookListPage},
            {index: true, path: '/books/:page', Component: BookListPage},
        ],
    },
]);

export function Router() {
    return <RouterProvider router={router} />;
}
