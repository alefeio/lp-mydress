// types/index.ts
import React from "react";

export type BaseProduct = {
  id: number;
  img: string;
  productMark?: string;
  productModel?: string;
  cor: string;
};

export type Collection = {
  title: string;
  subtitle: string;
  description: React.ReactNode;
  bgcolor: string;
  buttonText: string;
  items: BaseProduct[];
};

export type CollectionKey =
  | "blueDresses"
  | "blackDresses"
  | "pinkDresses"
  | "greenDresses"
  | "redDresses"
  | "orangeDresses"
  | "midisBrancos"
  | "clutches";

export type CategoryKey = "dresses" | "accessories";

export type Collections = {
  dresses: Array<Record<CollectionKey, Collection>>;
  accessories: Array<Record<CollectionKey, Collection>>;
  articles: never[];
};
