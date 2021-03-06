import { ErrorMapper } from "utils/ErrorMapper";
import cleanUpCreepMemory from "utils/Cleanup";

import roleHarvester from "roles/harvester/Role";
import roleBuilder from "roles/builder/Role";
import roleDrone from "roles/drone/Role";

import controlPopulation from "spawn/PopController";
import { ROLE_HARVESTER, ROLE_BUILDER, ROLE_DRONE, ROLE_LOGI } from "constants/RoleNames";

type CreepRoleDictionary = { [key: string]: (c: Creep) => void };

const creepRoles: CreepRoleDictionary = {
    [ROLE_HARVESTER]: roleHarvester,
    [ROLE_BUILDER]: roleBuilder,
    [ROLE_DRONE]: roleDrone.bind(null, null, 0.95),
    [ROLE_LOGI]: roleDrone.bind(null, STRUCTURE_ROAD, 0.6)
};

function runCreepAI(creep: Creep) {
    const roleFn = creepRoles[creep.memory.role];
    if (roleFn) {
        roleFn(creep);
    } else {
        const defaultRole = Object.keys(creepRoles)[0];
        console.log(`${creep.name} is assuming default role: ${defaultRole}`);
        creep.memory.role = defaultRole;
    }
}

export const loop = ErrorMapper.wrapLoop(() => {
    console.log(`Current game tick is ${Game.time}`);
    cleanUpCreepMemory();
    controlPopulation();
    _.forEach(Game.creeps, runCreepAI);
});
