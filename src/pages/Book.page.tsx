import {useParams} from "react-router";
import {AppShell} from "@mantine/core";

export function BookPage() {
    const params = useParams();
    return (
        <>
            <AppShell.Navbar p="md">
            </AppShell.Navbar>
            <AppShell.Main>
                <p>BookID: {params.id}</p>
            </AppShell.Main>
        </>
    );
}
