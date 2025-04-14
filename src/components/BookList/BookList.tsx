import {Badge, Card, Center, Group, Image, Indicator, Paper, SimpleGrid, Text, Tooltip} from "@mantine/core";
import {Link} from "react-router";
import {IconFileSad, IconFileSearch} from "@tabler/icons-react";

export type BookListItem = {
    id: number,
    title: string,
    subTitle: string,
    edition: number,
    pages: number,
    publisher: string,
    pubDate: Date,
    bookFileSize: number,
    fileTypes: string[],
    coverFileName: string,
}

type BookListProps = {
    books: BookListItem[];
}

const coverApiUrl: string = `${import.meta.env.VITE_API_URL}/v1/covers`

function getNumberWithOrdinal(n: number): string {
    const s: string[] = ["th", "st", "nd", "rd"],
        v: number = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export const BookList = (props: BookListProps) => {

    const books = props.books.map((book: BookListItem) => {
        const bookFileSize: string = (book.bookFileSize / 1024 / 1024).toFixed(1)
        const coverUrl: string = `${coverApiUrl}/${book.publisher.toLowerCase()}/${book.coverFileName}`;
        const pubDate: string = book.pubDate.toLocaleDateString("en-us", {month: "short", year: "numeric"});
        const hideTooltip: boolean = book.subTitle === "";
        return (
            <Card key={book.id} shadow="sm" padding="sm" radius="md" withBorder={true}>
                <Tooltip withArrow arrowSize={8} multiline openDelay={200} w={250}
                         hidden={hideTooltip} label={book.subTitle}>
                    <Card.Section>
                        <Indicator position="top-center" offset={0} size={20} zIndex={0} color="blue"
                                   label={pubDate}>
                            <Link to={`/books/${book.id}`}>
                                <Image mt="15" src={coverUrl} alt="book cover" h={220} fit="contain"/>
                            </Link>
                        </Indicator>
                        {book.edition > 1 && <Indicator position="top-center"
                                                        offset={0} size={20} zIndex={0} color="blue"
                                                        label={`${getNumberWithOrdinal(book.edition)} Edition`}>
                        </Indicator>}
                    </Card.Section>
                </Tooltip>
                <Group justify="space-between" mt="xs" mb="xs">
                    <Text lineClamp={2} h={50}>{book.title}</Text>
                </Group>
                <Group>
                    <Badge color="indigo" variant="light">{book.pages} pages</Badge>
                    <Badge color="cyan" variant="light">{bookFileSize} Mb</Badge>
                </Group>
                <Group mt='10'>
                    {book.fileTypes.length > 0 && (
                        book.fileTypes.map((fileType: string) => (
                            <Badge color="green" variant="outline" radius="3" p="5" mx="-3">{fileType}</Badge>
                        ))
                    )}
                </Group>
            </Card>
        );
    })

    return (
        books.length > 0 ? (
            <SimpleGrid
                cols={{base: 1, sm: 2, md: 3, lg: 4, xl: 5}}
                spacing={{base: 'xs', sm: 'md'}}
                verticalSpacing={{base: 'xs', sm: 'sm'}}
            >
                {books}
            </SimpleGrid>
        ) : (
            <Paper shadow="xs" p="xl">
                <Center>
                    <IconFileSad size="100"/>
                    <Text mx="xs" ta="center">Nothing Found</Text>
                    <IconFileSearch size="100"/>
                </Center>
            </Paper>
        )
    );
}
