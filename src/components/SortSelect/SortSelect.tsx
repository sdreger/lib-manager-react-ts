import {Select} from "@mantine/core";

type SortSelectProps = {
    onChange: (val: SortType) => void;
    value: SortType;
}

export type SortType = "pub_date,asc" | "pub_date,desc" | "id,asc" | "id,desc" | "title,asc" | "title,desc" |
    "subtitle,asc" | "subtitle,desc" | "created_at,asc" | "created_at,desc" | "updated_at,asc" | "updated_at,desc";

type SortItem = {
    value: SortType;
    label: string;
};

export const SortSelect = (props: SortSelectProps) => {
    const sortItems: SortItem[] = [
        {value: "id,asc", label: "Book ID ↓"},
        {value: "id,desc", label: "Book ID ↑"},
        {value: "title,asc", label: "Title ↓"},
        {value: "title,desc", label: "Title ↑"},
        {value: "subtitle,asc", label: "Subtitle ↓"},
        {value: "subtitle,desc", label: "Subtitle ↑"},
        {value: "created_at,asc", label: "Created ↓"},
        {value: "created_at,desc", label: "Created ↑"},
        {value: "updated_at,asc", label: "Updated ↓"},
        {value: "updated_at,desc", label: "Updated ↑"},
        {value: "pub_date,asc", label: "Publication date ↓"},
        {value: "pub_date,desc", label: "Publication date ↑"},
    ];

    function handleOrderChange(val: string | null) {
        if (val !== null) {
            props.onChange(val as SortType);
        }
    }

    return (
        <Select
            checkIconPosition="right"
            defaultValue="{orderByValue}"
            value={props.value}
            data={sortItems}
            onChange={handleOrderChange}
        />
    );
}
