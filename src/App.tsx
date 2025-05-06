import '@mantine/core/styles.css';
import {MantineProvider} from '@mantine/core';
import {Router} from './Router';
import {theme} from './theme';
import {Notifications} from '@mantine/notifications';
import '@mantine/notifications/styles.css';

export default function App() {
    return (
        <MantineProvider theme={theme}>
            <Notifications/>
            <Router/>
        </MantineProvider>
    );
}
