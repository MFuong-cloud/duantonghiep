import React from "react";

interface AdminPageLayoutProps {
    children: React.ReactNode;
    header?: React.ReactNode;
}

/**
 * Layout wrapper cho các trang admin
 * - Header cố định ở trên
 * - Content (table) có thể cuộn
 */
export default function AdminPageLayout({ children, header }: AdminPageLayoutProps) {
    return (
        <div className="flex flex-col h-full">
            {/* Header cố định */}
            {header && (
                <div className="flex-shrink-0 mb-6">
                    {header}
                </div>
            )}

            {/* Content có thể cuộn */}
            <div className="flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    );
}
