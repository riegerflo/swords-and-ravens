import HouseCardAbility from "./HouseCardAbility";
import HouseCard, { HouseCardState } from "./HouseCard";
import House from "../House";
import CombatGameState from "../../action-game-state/resolve-march-order-game-state/combat-game-state/CombatGameState";

export default class RamsayBoltonAdwdHouseCardAbility extends HouseCardAbility {
    modifySwordIcons(_combat: CombatGameState, _house: House, _houseCard: HouseCard, _affectedHouseCard: HouseCard): number {
        return this.doesTrigger(_houseCard, _affectedHouseCard, _house) ? 3 : 0;
    }

    modifyHouseCardCombatStrength(_combat: CombatGameState, _house: House, _houseCard: HouseCard, _affectedHouseCard: HouseCard): number {
        return this.doesTrigger(_houseCard, _affectedHouseCard, _house) ? 1 : 0;
    }

    doesTrigger(houseCard: HouseCard, affectedHouseCard: HouseCard, house: House): boolean {
        if (!house.houseCards.has("reek-adwd")) {
            // This should never happen as Stannis Baratheon will always be with Ser Davos
            // Seaworth. It could happen if a house is created with Davos but without Stannis.
            return false;
        }

        const reekAdwd = house.houseCards.get("reek-adwd");

        return houseCard == affectedHouseCard && reekAdwd.state == HouseCardState.AVAILABLE;
    }
}
