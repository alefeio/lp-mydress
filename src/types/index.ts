export type Dress = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

export type Clutch = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

export type MidiWhiteDress = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

export interface Product {
  id: number;
  img: string;
  productModel?: string;
  productMark?: string;
  cor: string;
}