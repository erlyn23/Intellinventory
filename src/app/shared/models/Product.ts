import { ProductNote } from './ProductNote';

export interface Product
{
    Code: string;
    Name: string;
    Entry: number;
    Exit: number;
    InitialCuantity: number;
    EntryNotes: ProductNote[];
    ExitNotes: ProductNote[];
    ActualInventory: number;
    Difference: number;
    EntrySum: number;
    TotalExistence: number;
    FinalNote: string;
}