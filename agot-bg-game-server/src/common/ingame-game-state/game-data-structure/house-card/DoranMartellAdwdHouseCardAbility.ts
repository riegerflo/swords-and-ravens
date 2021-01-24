import HouseCardAbility from "./HouseCardAbility";
import HouseCard, { HouseCardState } from "./HouseCard";
import House from "../House";
import CombatGameState from "../../action-game-state/resolve-march-order-game-state/combat-game-state/CombatGameState";

export default class DoranMartellAdwdHouseCardAbility extends HouseCardAbility {

    modifyHouseCardCombatStrength(_combat: CombatGameState, _house: House, _houseCard: HouseCard, _affectedHouseCard: HouseCard): number {
        var cardsInHand = 0;

        _house.houseCards.forEach((card, _) =>{
        if (card.state == HouseCardState.AVAILABLE) {
            cardsInHand += 1;
            }
        });

        if (cardsInHand >= 4) {
            cardsInHand = 4
        }

        return _houseCard == _affectedHouseCard ? -cardsInHand : 0;
    }
    modifySwordIcons(_combat: CombatGameState, _house: House, _houseCard: HouseCard, _affectedHouseCard: HouseCard): number {
        var cardsInHand = 0;

        _house.houseCards.forEach((card, _) =>{
        if (card.state == HouseCardState.AVAILABLE) {
            cardsInHand += 1;
            }
        });
        
        return _houseCard == _affectedHouseCard ? cardsInHand : 0;
    }
    modifyTowerIcons(_combat: CombatGameState, _house: House, _houseCard: HouseCard, _affectedHouseCard: HouseCard): number {
        var cardsInHand = 0;

        _house.houseCards.forEach((card, _) =>{
        if (card.state == HouseCardState.AVAILABLE) {
            cardsInHand += 1;
            }
        });
        
        return _houseCard == _affectedHouseCard ? cardsInHand : 0;
    }

}
