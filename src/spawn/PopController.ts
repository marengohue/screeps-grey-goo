import { DEFAULT_SPAWN_NAME } from "constants/Names";
import { ROLE_HARVESTER, ROLE_BUILDER } from "constants/RoleNames";

const desiredPopulationByRole: { [role: string]: number } = {
    [ROLE_HARVESTER]: 15,
    [ROLE_BUILDER]: 2
};

export default function controlPopulation() {
    const roleCounts = {
        ..._.mapValues(desiredPopulationByRole, () => 0),
        ..._.countBy(Game.creeps, c => c.memory.role)
    };
    const roleArray = _.chain(roleCounts)
        .pairs()
        .sortByOrder((pair) => pair[1])
        .value();
    _.find(roleArray, ([role, count]) => {
        if (role && count as number < desiredPopulationByRole[role as string]) {
            console.log(role, count, desiredPopulationByRole[role as string]);
            const spawn = Game.spawns[DEFAULT_SPAWN_NAME];
            console.log("Spawning a " + role);
            const result = spawn
                .spawnCreep(
                    [WORK, CARRY, MOVE],
                    `GooDrop-${new Date().getTime()}`,
                    { memory: { role } as any }
                );
            return result === OK;
        }
        return null;
    });
}
