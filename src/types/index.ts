// types/index.ts
import React from "react";

export interface BaseProduct {
    img: string;
    productMark?: string;
    productModel?: string;
    description?: string;
}

export interface Collection {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    items: BaseProduct[];
    bgcolor: string;
    buttonText: string;
}

export interface ModalHeaderFooterProps {
    productMark: string | undefined;
    productModel: string | undefined;
    shareUrl: string;
    modalIdx: number;
    modalType: string | null;
    onReserveClick?: () => void;
}