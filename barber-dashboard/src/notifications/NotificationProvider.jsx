import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Notification from "../components/Notification";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const [current, setCurrent] = useState(null);

    const showNotification = useCallback((payload) => {
        const { message, type, duration = 3000 } = payload || {};
        if (!message || !type) return;

        setCurrent({ message, type, duration });
    }, []);

    const close = useCallback(() => setCurrent(null), []);

    useEffect(() => {
        const handler = (e) => {
            const detail = e?.detail;
            if (detail) showNotification(detail);
        };
        window.addEventListener("show-notification", handler);
        return () => window.removeEventListener("show-notification", handler);
    }, [showNotification]);

    return (
        <NotificationContext.Provider value={{ showNotification, close }}>
            {children}
            {current && (
                <Notification
                    message={current.message}
                    type={current.type}
                    duration={current.duration}
                    onClose={close}
                />
            )}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error("useNotification deve ser usado dentro de NotificationProvider");
    return ctx;
}