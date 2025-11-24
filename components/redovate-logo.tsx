import React from "react";

export function RedovateLogo({ className, ...props }: React.ComponentProps<"svg">) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            fill="none"
            className={className}
            {...props}
        >
            <rect width="256" height="256" rx="60" fill="#3B82F6" />
            <path
                d="M168 168L142.5 124H152C169.673 124 184 109.673 184 92C184 74.3269 169.673 60 152 60H88V196H120V148H132L159.5 196H196L168 168Z"
                fill="white"
            />
            <path
                d="M120 124V92H152C160.837 92 168 99.1634 168 108C168 116.837 160.837 124 152 124H120Z"
                fill="#3B82F6"
            />
        </svg>
    );
}

export function RedovateIcon({ className, ...props }: React.ComponentProps<"svg">) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            fill="none"
            className={className}
            {...props}
        >
            <rect width="256" height="256" rx="60" fill="#3B82F6" />
            <path
                d="M168 168L142.5 124H152C169.673 124 184 109.673 184 92C184 74.3269 169.673 60 152 60H88V196H120V148H132L159.5 196H196L168 168Z"
                fill="white"
            />
            <path
                d="M120 124V92H152C160.837 92 168 99.1634 168 108C168 116.837 160.837 124 152 124H120Z"
                fill="#3B82F6"
            />
        </svg>
    );
}
