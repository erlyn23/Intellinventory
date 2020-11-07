import { Product } from './Product';

export interface Inventory{
    Key: string;
    Name: string; 
    CreationDate: string;
    State: string;
    Products: Product[];
}