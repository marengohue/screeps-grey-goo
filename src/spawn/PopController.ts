import { DEFAULT_SPAWN_NAME } from 'constants/Names';
import {
    ROLE_BUILDER,
    ROLE_DRONE,
    ROLE_HARVESTER,
    ROLE_LOGI
    } from 'constants/RoleNames';

const desiredPopulationByRole: { [role: string]: number } = {
    [ROLE_HARVESTER]: 15,
    [ROLE_BUILDER]: 2,
    [ROLE_DRONE]: 1,
    [ROLE_LOGI]: 3
};

export default function controlPopulation() {
    const targetSpawn = Game.spawns[DEFAULT_SPAWN_NAME];
    if (!targetSpawn.canCreateCreep) return;
    const roleCounts = {
        ..._.mapValues(desiredPopulationByRole, () => 0),
        ..._.countBy(Game.creeps, c => c.memory.role)
    };
    const roleArray = _.chain(roleCounts)
        .pairs()
        .sortByOrder(([role, count]: [string, number]) => count / desiredPopulationByRole[role])
        .valueOf() as [string, number][];
    roleArray.some(([role, count]) => {
        if (role && count < desiredPopulationByRole[role]) {
            const filledPercentage = Math.round(count / desiredPopulationByRole[role] * 100);
            console.log(`Spawning a ${role} - ${count}/${desiredPopulationByRole[role]} (${filledPercentage}% filled)`);
            Game
                .spawns[DEFAULT_SPAWN_NAME]
                .spawnCreep(
                    [WORK, CARRY, MOVE],
                    `GooDrop-${new Date().getTime()}`,
                    { memory: { role } as any }
                );
            return true;
        }
        return false;
    });
}
