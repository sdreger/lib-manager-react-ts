import {notifications} from "@mantine/notifications";

type ApiErrorResponse = {
    field: string;
    message: string;
}

export type ApiErrorsResponse = {
    errors: ApiErrorResponse[];
}

export function handleError(title: string, error: ApiErrorsResponse): void {
    const message: string = error.errors.map((err: ApiErrorResponse): string => {
        return err.message
    }).join(",")
    console.error(message);
    showErrorNotification(title, message);
}

export function showErrorNotification(title: string, message: string): void {
    notifications.show({
        color: 'red',
        message: message,
        title: title,
        position: "bottom-right",
        autoClose: 5000,
        withBorder: true
    })
}
