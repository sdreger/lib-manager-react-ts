import {AppShell, Autocomplete, Divider, Skeleton} from "@mantine/core";
import {SortSelect, SortType} from "@/components/SortSelect/SortSelect.tsx";
import {KeyboardEvent, useState} from "react";

export type BookSearchFilters = {
    searchTerm: string;
    orderBy: string;
}

type BookSearchNavbarProps = {
    onFiltersChange: (filters: BookSearchFilters) => void;
}

export const BookSearchNavbar = (props: BookSearchNavbarProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [orderByValue, setOrderByValue] = useState("updated_at,desc" as SortType);

    function handleSearchTermChange(newSearchTerm: string) {
        setSearchTerm(newSearchTerm);
        if (newSearchTerm === "" && searchTerm !== "") {
            props.onFiltersChange({
                orderBy: orderByValue,
                searchTerm: "",
            })
        }
    }

    function handleSearchTermClear() {
        setSearchTerm("");
        props.onFiltersChange({
            orderBy: orderByValue,
            searchTerm: "",
        })
    }

    function handleSearchEnterKeyPress(evt: KeyboardEvent) {
        if (evt.key === 'Enter') {
            props.onFiltersChange({
                orderBy: orderByValue,
                searchTerm: searchTerm,
            })
        }
    }

    function handleOrderChange(val: SortType) {
        setOrderByValue(val);
        props.onFiltersChange({
            orderBy: val,
            searchTerm: searchTerm,
        })
    }

    return (
        <AppShell.Navbar p="md">
            <Divider my='xs' label="Search" labelPosition="center"/>
            <Autocomplete
                clearable
                value={searchTerm}
                placeholder="Search..."
                onChange={handleSearchTermChange}
                onClear={handleSearchTermClear}
                onKeyDown={handleSearchEnterKeyPress}
            />
            <Divider my='xs' label="Sort" labelPosition="center"/>
            <SortSelect value={orderByValue as SortType} onChange={handleOrderChange}/>
            {Array(15)
                .fill(0)
                .map((_, index) => (
                    <Skeleton key={index} h={28} mt="sm" animate={false}/>
                ))}
        </AppShell.Navbar>
    );
}
