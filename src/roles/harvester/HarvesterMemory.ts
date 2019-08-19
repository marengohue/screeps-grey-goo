export interface HarvesterMemory {
    state: "mining" | "dropping" | "idle";
    dropoffId: string;
    dropoffType: "spawn" | "controller";
    sourceId: string;
}
