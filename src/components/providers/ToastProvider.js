"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3500,
                style: {
                    background: "#1c1917",
                    color: "#fafaf9",
                    borderRadius: "10px",
                    fontSize: "14px",
                },
                success: {
                    iconTheme: {
                        primary: "#d97706",
                        secondary: "#ffffff",
                    },
                },
            }}
        />
    );
}