import { DroneMemory } from "./DroneMemory";

function filterByType(s: Structure, filter: StructureConstant | null): boolean {
    return filter ? s.structureType === filter : true;
}

function findRepairTarget(structureFilter: StructureConstant | null, threshold: number, creep: Creep, memory: DroneMemory) {
    const findArg = structureFilter ? FIND_STRUCTURES : FIND_MY_STRUCTURES;
    const structuresToRepair = creep.room.find(findArg, {
        filter: (s) => filterByType(s, structureFilter) && s.hits < threshold * s.hitsMax
    });
    if (structuresToRepair.length) {
        memory.targetId = structuresToRepair[0].id;
    }
}

function ensureMemory(creep: Creep): DroneMemory {
    creep.memory.roleMemory = creep.memory.roleMemory || {};
    return creep.memory.roleMemory;
}

function runRepairLogic(creep: Creep, memory: DroneMemory) {
    if (creep.carry.energy === 0) {
        const energyContainer = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_SPAWN
        })[0];
        if (energyContainer) {
            if (creep.withdraw(energyContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(energyContainer);
            }
        }
    } else {
        const target = Game.getObjectById<Structure>(memory.targetId);
        if (!target) {
            return;
        }
        if (creep.repair(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        if (target.hits === target.hitsMax) {
            delete memory.targetId;
        }
    }
}

export default function run(structureFilter: StructureConstant | null, threshold: number, creep: Creep) {
    const memory = ensureMemory(creep);
    if (memory.targetId) {
        runRepairLogic(creep, memory);
    } else {
        findRepairTarget(structureFilter, threshold, creep, memory);
    }
}
