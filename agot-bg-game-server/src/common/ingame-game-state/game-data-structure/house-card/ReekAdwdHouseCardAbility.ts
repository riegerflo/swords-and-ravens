import HouseCardAbility from "./HouseCardAbility";
import AfterWinnerDeterminationGameState
    from "../../action-game-state/resolve-march-order-game-state/combat-game-state/post-combat-game-state/after-winner-determination-game-state/AfterWinnerDeterminationGameState";
import House from "../House";
import HouseCard, {HouseCardState} from "./HouseCard";
import ImmediatelyHouseCardAbilitiesResolutionGameState
    from "../../action-game-state/resolve-march-order-game-state/combat-game-state/immediately-house-card-abilities-resolution-game-state/ImmediatelyHouseCardAbilitiesResolutionGameState";


export default class ReekAdwdHouseCardAbility extends HouseCardAbility {
    returnedCards: HouseCard[] = [];
    immediatelyResolution(immediatelyResolutionState: ImmediatelyHouseCardAbilitiesResolutionGameState, house: House, _houseCard: HouseCard): void {
        const ramsayBolton = house.houseCards.get("ramsay-bolton-adwd");
        const houseCards = house.houseCards.values.filter(hc => hc.id  == "ramsay-bolton-adwd");
        if (ramsayBolton.state == HouseCardState.USED) {
            houseCards.forEach(hc => hc.state = HouseCardState.AVAILABLE);
            this.returnedCards.push(ramsayBolton)
            immediatelyResolutionState.entireGame.broadcastToClients({
                type: "change-state-house-card",
                houseId: house.id,                
                cardIds: houseCards.map(hc => hc.id),
                state: HouseCardState.AVAILABLE
            });
        }
        immediatelyResolutionState.childGameState.onHouseCardResolutionFinish(house);
    }

    afterWinnerDetermination(afterWinnerDetermination: AfterWinnerDeterminationGameState, house: House, _houseCard: HouseCard): void {
        const houseCards = house.houseCards.values.filter(hc => hc.id  == "reek-adwd");
        houseCards.forEach(hc => hc.state = HouseCardState.AVAILABLE);
        if (afterWinnerDetermination.postCombatGameState.loser == house) {

            const reek = house.houseCards.get("reek-adwd");
            this.returnedCards.push(reek)
            afterWinnerDetermination.entireGame.broadcastToClients({
                type: "change-state-house-card",
                houseId: house.id,
                cardIds: houseCards.map(hc => hc.id),
                state: HouseCardState.AVAILABLE
            });
            
        }
        afterWinnerDetermination.combatGameState.ingameGameState.log({
            type: "reek-house-cards-returned",
            house: house.id,
            houseCards: this.returnedCards.map(hc => hc.id)
        });      
        afterWinnerDetermination.childGameState.onHouseCardResolutionFinish(house);
    }
};
