import HouseCardAbility from "./HouseCardAbility";
import HouseCard, { HouseCardState } from "./HouseCard";
import House from "../House";
import CombatGameState from "../../action-game-state/resolve-march-order-game-state/combat-game-state/CombatGameState";
import AfterWinnerDeterminationGameState
    from "../../action-game-state/resolve-march-order-game-state/combat-game-state/post-combat-game-state/after-winner-determination-game-state/AfterWinnerDeterminationGameState";

export default class QarlTheMaidAdwdHouseCardAbility extends HouseCardAbility {
    afterWinnerDetermination(afterWinnerDetermination: AfterWinnerDeterminationGameState, house: House, _houseCard: HouseCard): void {
        
        if (afterWinnerDetermination.postCombatGameState.loser == house || afterWinnerDetermination.combatGameState.attacker == house) {
                const powerTokensGained = afterWinnerDetermination.combatGameState.ingameGameState.changePowerTokens(house, 3);

                afterWinnerDetermination.combatGameState.ingameGameState.log({
                    type: "qarl-the-maid-power-tokens-gained",
                    house: house.id,
                    powerTokensGained: powerTokensGained
                });
        
        }
        afterWinnerDetermination.childGameState.onHouseCardResolutionFinish(house);
    }
}
