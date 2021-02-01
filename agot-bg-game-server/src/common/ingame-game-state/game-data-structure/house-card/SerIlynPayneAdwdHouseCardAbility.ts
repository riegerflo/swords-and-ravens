import HouseCardAbility from "./HouseCardAbility";
import HouseCard, { HouseCardState } from "./HouseCard";
import House from "../House";
import AfterWinnerDeterminationGameState
    from "../../action-game-state/resolve-march-order-game-state/combat-game-state/post-combat-game-state/after-winner-determination-game-state/AfterWinnerDeterminationGameState";
import SerIlynPayneAbilityGameState
    from "../../action-game-state/resolve-march-order-game-state/combat-game-state/post-combat-game-state/after-winner-determination-game-state/ser-ilyn-payne-ability-game-state/SerIlynPayneAbilityGameState";

export default class SerIlynPaybeAdwdHouseCardAbility extends HouseCardAbility {
    afterWinnerDetermination(afterWinnerDetermination: AfterWinnerDeterminationGameState, house: House, _houseCard: HouseCard): void {
        if (afterWinnerDetermination.postCombatGameState.winner == house) {
        afterWinnerDetermination.childGameState.setChildGameState(new SerIlynPayneAbilityGameState(afterWinnerDetermination.childGameState))
            .firstStart(house);
        }
    }
}
