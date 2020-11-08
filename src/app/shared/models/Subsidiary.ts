import { Inventory } from './Inventory';

export interface Subsidiary
{
    Key: string;
    Boss: string;
    Name: string;
    Password: string;
    Inventories: Inventory[];
}