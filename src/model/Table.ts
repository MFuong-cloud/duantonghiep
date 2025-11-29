export interface Table {
    id: number;
    name: string;
    capacity: number;
    status: "available" | "occupied" | "reserved";
    branch_id?: number;
}
