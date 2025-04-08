import {Link, Outlet} from "react-router";
import {useDisclosure} from "@mantine/hooks";
import {
    ActionIcon,
    AppShell,
    Autocomplete,
    Avatar,
    Burger,
    Button,
    Group,
    Image,
    MantineColorScheme,
    Menu,
    useMantineColorScheme
} from "@mantine/core";
import {IconSettings, IconSortAscendingShapes, IconSunMoon} from '@tabler/icons-react';
import bookShelfLogo from '/bookshelf.svg'
import {useState} from "react";
import {SortSelect, SortType} from "@/components/SortSelect/SortSelect";

export function Root() {
    const [mobileOpened, {toggle: toggleMobile}] = useDisclosure();
    const [desktopOpened, {toggle: toggleDesktop}] = useDisclosure(true);
    const [settingsMenuOpened, setSettingsMenuOpened] = useState(false);
    const [colorSchemeValue, setColorSchemeValue] = useState("auto")
    const [orderByValue, setOrderByValue] = useState("updated_at,desc" as SortType);
    const {setColorScheme} = useMantineColorScheme();

    const menuIconSize = 18;

    function handleColorSchemeChange(val: string) {
        setColorScheme(val as MantineColorScheme);
        setColorSchemeValue(val);
    }

    function handleOrderChange(val: SortType) {
        setOrderByValue(val);
    }

    return (
        <AppShell
            header={{height: 60}}
            navbar={{
                width: 300,
                breakpoint: 'xs',
                collapsed: {mobile: !mobileOpened, desktop: !desktopOpened},
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Link to="/">
                        <Image src={bookShelfLogo} alt="bookshelf logo"/>
                    </Link>
                    <Group justify="space-between" style={{flex: 1}}>
                        <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm"/>
                        <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm"/>
                        <Group ml="xl" gap={10}>
                            <Autocomplete
                                clearable
                                w={130}
                                placeholder="Search..."/>
                            <Menu shadow="md" width={270} opened={settingsMenuOpened}
                                  onDismiss={() => setSettingsMenuOpened(false)}>
                                <Menu.Target>
                                    <ActionIcon variant="filled" aria-label="Settings"
                                                onClick={() => setSettingsMenuOpened(!settingsMenuOpened)}>
                                        <IconSettings style={{width: '70%', height: '70%'}} stroke={1.5}/>
                                    </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Label>Settings</Menu.Label>
                                    <Menu.Item leftSection={<IconSortAscendingShapes size={menuIconSize}/>}>
                                        <SortSelect value={orderByValue as SortType} onChange={handleOrderChange}/>
                                    </Menu.Item>
                                    <Menu.Label>Color Scheme</Menu.Label>
                                    <Button.Group m="xs">
                                        <IconSunMoon style={{margin: '10 10 10 0'}} size={menuIconSize}/>
                                        <Button variant={colorSchemeValue === 'auto' ? 'filled' : 'default'}
                                                onClick={() => handleColorSchemeChange("auto")}>Auto</Button>
                                        <Button variant={colorSchemeValue === 'light' ? 'filled' : 'default'}
                                                onClick={() => handleColorSchemeChange("light")}>Light</Button>
                                        <Button variant={colorSchemeValue === 'dark' ? 'filled' : 'default'}
                                                onClick={() => handleColorSchemeChange("dark")}>Dark</Button>
                                    </Button.Group>

                                </Menu.Dropdown>
                            </Menu>
                            <Avatar color="cyan" radius="xl">SD</Avatar>
                        </Group>
                    </Group>
                </Group>
            </AppShell.Header>
            <Outlet/>
        </AppShell>
    );
}
