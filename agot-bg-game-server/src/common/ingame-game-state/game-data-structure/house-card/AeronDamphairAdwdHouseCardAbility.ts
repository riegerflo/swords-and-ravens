import HouseCardAbility from "./HouseCardAbility";
import HouseCard from "./HouseCard";
import House from "../House";
import CombatGameState from "../../action-game-state/resolve-march-order-game-state/combat-game-state/CombatGameState";
import AeronDamphairAdwdAbilityGameState from "../../action-game-state/resolve-march-order-game-state/combat-game-state/immediately-house-card-abilities-resolution-game-state/aeron-damphair-adwd-ability-game-state/AeronDamphairAdwdAbilityGameState";
import ImmediatelyHouseCardAbilitiesResolutionGameState
    from "../../action-game-state/resolve-march-order-game-state/combat-game-state/immediately-house-card-abilities-resolution-game-state/ImmediatelyHouseCardAbilitiesResolutionGameState";

export default class AeronDamphairAdwdHouseCardAbility extends HouseCardAbility {
    abilityGameState: AeronDamphairAdwdAbilityGameState | null = null;

    immediatelyResolution(immediatelyResolutionState: ImmediatelyHouseCardAbilitiesResolutionGameState, house: House, _houseCard: HouseCard): void {
        this.abilityGameState = new AeronDamphairAdwdAbilityGameState(immediatelyResolutionState.childGameState);
        immediatelyResolutionState.childGameState.setChildGameState(this.abilityGameState)
            .firstStart(house);
    }

    modifyHouseCardCombatStrength(combat: CombatGameState, house: House, houseCard: HouseCard, affectedHouseCard: HouseCard): number {
        return (this.abilityGameState && houseCard==affectedHouseCard) ? this.abilityGameState.combatStrengthModifier : 0;
    }
}
