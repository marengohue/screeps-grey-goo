import { DEFAULT_SPAWN_NAME } from "constants/Names";
import { HarvesterMemory } from "./HarvesterMemory";

type DropoffTuple = [
    Structure,
    () => ScreepsReturnCode
];

function getDefaultSpawn(): StructureSpawn {
    return Game.spawns[DEFAULT_SPAWN_NAME];
}

function findDropoffTarget(memory: HarvesterMemory): void {
    const defaultSpawn = getDefaultSpawn();
    memory.state = "dropping";
    if (defaultSpawn.energy < defaultSpawn.energyCapacity) {
        memory.dropoffId = defaultSpawn.id;
        memory.dropoffType = "spawn";
    } else if (defaultSpawn.room.controller) {
        memory.dropoffId = defaultSpawn.room.controller.id;
        memory.dropoffType = "controller";
    } else {
        memory.state = "idle";
    }
}

function getDropoffWithAction(creep: Creep, memory: HarvesterMemory): DropoffTuple {
    if (memory.dropoffType === "controller") {
        const controller = Game.getObjectById<StructureController>(memory.dropoffId);
        if (controller) {
            return [controller, () => creep.upgradeController(controller)];
        }
    } else {
        const spawn = Game.getObjectById<StructureSpawn>(memory.dropoffId);
        if (spawn) {
            return [spawn, () => creep.transfer(spawn, RESOURCE_ENERGY)]
        }
    }

    throw new Error("Can't find dropoff :C");
}

function getRoleMemory(creep: Creep): HarvesterMemory {
    const roleMemory = creep.memory.roleMemory as HarvesterMemory;
    return roleMemory || (creep.memory.roleMemory = { state: "idle" });
}

function findMiningTarget(creep: Creep, memory: HarvesterMemory) {
    const closestSrc = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (closestSrc) {
        memory.sourceId = closestSrc.id;
        memory.state = "mining";
    }
}

function runIdleState(creep: Creep, memory: HarvesterMemory) {
    if (creep.carry.energy < creep.carryCapacity) {
        findMiningTarget(creep, memory);
    } else {
        findDropoffTarget(memory)
    }
    if (memory.state === "idle") {
        creep.moveTo(getDefaultSpawn());
    }
}

function runMiningState(creep: Creep, memory: HarvesterMemory) {
    if (creep.carry.energy >= creep.carryCapacity) {
        memory.state = "idle";
        delete memory.sourceId;
    } else {
        const source = Game.getObjectById<Source>(memory.sourceId);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.room.visual.line(creep.pos, source.pos, { color: "#ffaaaa" });
            creep.moveTo(source);
        }
    }
}

function runDroppingState(creep: Creep, memory: HarvesterMemory) {
    if (creep.carry.energy === 0) {
        memory.state = "idle";
        delete memory.dropoffId;
        delete memory.dropoffType;
    } else {
        const [dropoff, dropoffAction] = getDropoffWithAction(creep, memory);
        if (dropoffAction() === ERR_NOT_IN_RANGE) {
            creep.room.visual.line(creep.pos, dropoff.pos, { color: "#aaaaff" });
            creep.moveTo(dropoff);
        }
    }
}

export default function run(creep: Creep) {
    const memory = getRoleMemory(creep);
    switch (memory.state) {
        case "idle": runIdleState(creep, memory); break;
        case "mining": runMiningState(creep, memory); break;
        case "dropping": runDroppingState(creep, memory); break;
    }
}
