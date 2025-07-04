import {BookItem} from "@/api/BookApi.ts";
import {Badge, Grid, Group, List, Paper, Spoiler, Text, Title} from "@mantine/core";

type BookDetailsProps = {
    book: BookItem;
}

export const BookDetails = (props: BookDetailsProps) => {
    const book: BookItem = props.book;
    return (
        <Paper shadow="md" radius="md" p="sm">
            <Title order={3}>{book.title}</Title>
            <Title order={5}>{book.subtitle ? book.subtitle : ""}</Title>
            <hr/>
            <Text fs="italic">{book.authors.join(", ")}</Text>
            <Group m='10'>
                {book.categories.map((category: string) => (
                        <Badge key={category} color="blue" variant="outline" radius="8" p="5" m="-5">
                            {category}
                        </Badge>
                    )
                )}
            </Group>
            <Grid py="lg">
                <Grid.Col span={{base: 12, lg: 6, xl: 4}}>
                    <List spacing="xs" size="sm" listStyleType="square">
                        <List.Item>Publisher: {book.publisher}</List.Item>
                        <List.Item>Published: {book.pub_date.toLocaleDateString('en-CA')}</List.Item>
                        <List.Item>Edition: {book.edition}</List.Item>
                    </List>
                </Grid.Col>
                <Grid.Col span={{base: 12, lg: 6, xl: 4}}>
                    <List spacing="xs" size="sm" listStyleType="square">
                        <List.Item>ISBN 10: {book.isbn10}</List.Item>
                        <List.Item>ISBN 13: {book.isbn13}</List.Item>
                        <List.Item>ASIN: {book.asin}</List.Item>
                    </List>
                </Grid.Col>
                <Grid.Col span={{base: 12, lg: 6, xl: 4}}>
                    <List spacing="xs" size="sm" listStyleType="square">
                        <List.Item>Page count: {book.pages}</List.Item>
                        <List.Item>File size: {(book.book_file_size / 1024 / 1024).toFixed(2)} Mb</List.Item>
                        <List.Item>File Types: {book.file_types.join(", ")}</List.Item>
                    </List>
                </Grid.Col>
            </Grid>
            <hr/>
            <Spoiler maxHeight={250} showLabel="Show more" hideLabel="Hide">
                <div dangerouslySetInnerHTML={{__html: book.description}}></div>
            </Spoiler>
        </Paper>
    );
}
