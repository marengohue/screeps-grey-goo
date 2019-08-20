export default function run(creep: Creep) {
    const structuresToBuild = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
    if (structuresToBuild.length) {
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
            if (creep.build(structuresToBuild[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(structuresToBuild[0]);
            }
        }
    }
}
