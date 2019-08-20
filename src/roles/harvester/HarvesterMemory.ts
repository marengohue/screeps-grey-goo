export interface HarvesterMemory {
    state: "mining" | "dropping" | "idle";
    dropoffId: string;
    dropoffType: "spawn" | "controller" | "extension" | "storage";
    sourceId: string;
    awaitingDropoffFor: number;
}
