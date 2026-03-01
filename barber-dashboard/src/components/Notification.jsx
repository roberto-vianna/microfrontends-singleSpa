import { useEffect } from "react";
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ExclamationCircleIcon,
} from "@heroicons/react/24/solid";

const typeStyles = {
    success: "bg-green-500 text-white",
    alert: "bg-yellow-500 text-white",
    error: "bg-red-500 text-white",
    default: "bg-gray-500 text-white",
};

const iconByType = {
    success: CheckCircleIcon,
    alert: ExclamationTriangleIcon,
    error: ExclamationCircleIcon,
};

export default function Notification({ message, type, duration = 3000, onClose }) {
    useEffect(() => {
        const id = setTimeout(() => onClose?.(), duration);
        return () => clearTimeout(id);
    }, [duration, onClose]);

    const Icon = iconByType[type] ?? iconByType.alert;

    return (
        <div
            className={[
                "fixed top-4 right-4 z-[9999] max-w-xs outline-2 px-4 py-2 rounded-lg",
                "transition-transform duration-300 cursor-pointer shadow-lg",
                typeStyles[type] || typeStyles.default,
            ].join(" ")}
            onClick={() => onClose?.()}
            role="alert"
        >
            <div className="flex items-center">
                <div className="mr-3 flex items-center justify-center rounded-full bg-opacity-25">
                    <Icon className="size-6" />
                </div>
                <p className="text-md font-medium my-0">{message}</p>
            </div>
        </div>
    );
}