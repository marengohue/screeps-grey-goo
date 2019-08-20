import { DEFAULT_SPAWN_NAME } from "constants/Names";
import { ROLE_HARVESTER, ROLE_BUILDER } from "constants/RoleNames";

let creepId = 0;

const desiredPopulationByRole: { [role: string]: number } = {
    [ROLE_HARVESTER]: 15,
    [ROLE_BUILDER]: 3
};

export default function controlPopulation() {
    const roleCounts = _.countBy(Game.creeps, c => c.memory.role);
    _.find(roleCounts, (count, role) => {
        if (role && count < desiredPopulationByRole[role]) {
            console.log("Spawning a " + role);
            const result = Game
                .spawns[DEFAULT_SPAWN_NAME]
                .spawnCreep(
                    [WORK, CARRY, MOVE],
                    `GooDrop-${creepId++}`,
                    { memory: { role } as any }
                );
            console.log(result);
            return result === OK;
        }
        return null;
    });
}
