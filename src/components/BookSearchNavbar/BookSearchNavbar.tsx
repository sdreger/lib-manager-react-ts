import {AppShell, Autocomplete, Divider, MultiSelect, ComboboxItem} from "@mantine/core";
import {SortSelect, SortType} from "@/components/SortSelect/SortSelect.tsx";
import {KeyboardEvent, useEffect, useState} from "react";
import PublisherApi from "@/api/PublisherApi.ts";

export type BookSearchFilters = {
    searchTerm: string;
    orderBy: string;
    publisherIds: string[];
}

type BookSearchNavbarProps = {
    onFiltersChange: (filters: BookSearchFilters) => void;
}

export const BookSearchNavbar = (props: BookSearchNavbarProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [orderByValue, setOrderByValue] = useState("updated_at,desc" as SortType);
    const [publishersFilter, setPublishersFilter] = useState<string[]>([]);
    const [publishersFilterValues, setPublishersFilterValues] = useState<Map<number, string>>(new Map());

    useEffect(() => {
        const fetchPublishers = async (): Promise<void> => {
            const publishers: Map<number, string> = await PublisherApi.getAllPublishers()
            setPublishersFilterValues(publishers);
        };
        void fetchPublishers();
    }, [])

    function handleSearchTermChange(newSearchTerm: string) {
        setSearchTerm(newSearchTerm);
        if (newSearchTerm === "" && searchTerm !== "") {
            props.onFiltersChange({
                orderBy: orderByValue,
                searchTerm: "",
                publisherIds: publishersFilter,
            })
        }
    }

    function handleSearchTermClear() {
        setSearchTerm("");
        props.onFiltersChange({
            orderBy: orderByValue,
            searchTerm: "",
            publisherIds: publishersFilter,
        })
    }

    function handleSearchEnterKeyPress(evt: KeyboardEvent) {
        if (evt.key === 'Enter') {
            props.onFiltersChange({
                orderBy: orderByValue,
                searchTerm: searchTerm,
                publisherIds: publishersFilter,
            })
        }
    }

    function handleOrderChange(val: SortType) {
        setOrderByValue(val);
        props.onFiltersChange({
            orderBy: val,
            searchTerm: searchTerm,
            publisherIds: publishersFilter,
        })
    }

    function handlePublisherFilterChange(val: string[]) {
        setPublishersFilter(val);
        props.onFiltersChange({
            orderBy: orderByValue,
            searchTerm: searchTerm,
            publisherIds: val,
        })
    }

    const publishersFilterData = [] as ComboboxItem[];
    for (const item of [...publishersFilterValues]) {
        const obj: ComboboxItem = {} as ComboboxItem;
        const [key, value] = item;
        obj.value = key.toString();
        obj.label = value;
        publishersFilterData.push(obj);
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
            <Divider my='xs' label="Filters" labelPosition="center"/>
            <MultiSelect
                clearable
                searchable
                label="Publishers"
                placeholder="Select filters"
                nothingFoundMessage="Nothing found..."
                data={publishersFilterData}
                onChange={handlePublisherFilterChange}
            />
        </AppShell.Navbar>
    );
}
