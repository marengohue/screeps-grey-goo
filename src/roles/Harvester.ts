import { DEFAULT_SPAWN_NAME } from "constants/Names";

type DropoffTuple = [
    Structure,
    () => ScreepsReturnCode
];

function getDefaultSpawn(): StructureSpawn {
    return Game.spawns[DEFAULT_SPAWN_NAME];
}

function getDropoffWithAction(creep: Creep): DropoffTuple {
    const defaultSpawn = getDefaultSpawn();
    if (defaultSpawn.energy < defaultSpawn.energyCapacity) {
        return [defaultSpawn, () => creep.transfer(defaultSpawn, RESOURCE_ENERGY)];
    } else {
        const controller = defaultSpawn.room.controller;
        if (controller) {
            return [controller, () => creep.upgradeController(controller)];
        }
    }

    throw new Error("Can't find dropoff :C");
}

function tryMining(creep: Creep) {
    const closestSrc = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (closestSrc === null) {
        creep.moveTo(getDefaultSpawn());
    } else if (creep.harvest(closestSrc) === ERR_NOT_IN_RANGE) {
        creep.moveTo(closestSrc);
    }
}

function returnHome(creep: Creep) {
    const [dropoff, dropoffAction] = getDropoffWithAction(creep);
    if (dropoffAction() === ERR_NOT_IN_RANGE) {
        creep.moveTo(dropoff);
    }
}

export default function run(creep: Creep) {
    if (creep.carry.energy < creep.carryCapacity) {
        tryMining(creep);
    } else {
        returnHome(creep);
    }
}
