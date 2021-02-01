import ImmediatelyHouseCardAbilitiesResolutionGameState from "../ImmediatelyHouseCardAbilitiesResolutionGameState";
import SimpleChoiceGameState, {SerializedSimpleChoiceGameState} from "../../../../../simple-choice-game-state/SimpleChoiceGameState";
import GameState from "../../../../../../GameState";
import House from "../../../../../game-data-structure/House";
import HouseCard, {HouseCardState}  from "../../../../../game-data-structure/house-card/HouseCard";
import Player from "../../../../../Player";
import Game from "../../../../../game-data-structure/Game";
import CombatGameState from "../../CombatGameState";
import _ from "lodash";
import {ClientMessage} from "../../../../../../../messages/ClientMessage";
import {ServerMessage} from "../../../../../../../messages/ServerMessage";
import IngameGameState from "../../../../../IngameGameState";

export default class ReekAbilityGameState extends GameState<
    ImmediatelyHouseCardAbilitiesResolutionGameState["childGameState"],
    SimpleChoiceGameState
> {
    get game(): Game {
        return this.parentGameState.game;
    }

    get combatGameState(): CombatGameState {
        return this.parentGameState.combatGameState;
    }

    get ingame(): IngameGameState {
        return this.parentGameState.parentGameState.parentGameState.ingameGameState;
    }

    onSimpleChoiceGameStateEnd(): void {       

    }

    firstStart(): void {
        const house = this.childGameState.house;
        const ramsayBolton = house.houseCards.get("ramsay-bolton-adwd");
        const houseCards = house.houseCards.values.filter(hc => hc.id  == "ramsay-bolton-adwd");
        if (ramsayBolton.state == HouseCardState.USED) {
            houseCards.forEach(hc => hc.state = HouseCardState.AVAILABLE);
        
            this.parentGameState.entireGame.broadcastToClients({
                type: "change-state-house-card",
                houseId: house.id,                
                cardIds: houseCards.map(hc => hc.id),
                state: HouseCardState.AVAILABLE
            });
        }
        this.parentGameState.onHouseCardResolutionFinish(this.childGameState.house);
    }


    onPlayerMessage(player: Player, message: ClientMessage): void {
        this.childGameState.onPlayerMessage(player, message);
    }

    onServerMessage(message: ServerMessage): void {
        this.childGameState.onServerMessage(message);
    }

    serializeToClient(admin: boolean, player: Player | null): SerializedReekAbilityGameState {
        return {
            type: "doran-martell-ability",
            childGameState: this.childGameState.serializeToClient(admin, player)
        };
    }

    static deserializeFromServer(houseCardResolution: ImmediatelyHouseCardAbilitiesResolutionGameState["childGameState"], data: SerializedReekAbilityGameState): ReekAbilityGameState {
        const doranMartellAbilityGameState = new ReekAbilityGameState(houseCardResolution);

        doranMartellAbilityGameState.childGameState = doranMartellAbilityGameState.deserializeChildGameState(data.childGameState);

        return doranMartellAbilityGameState;
    }

    deserializeChildGameState(data: SerializedReekAbilityGameState["childGameState"]): SimpleChoiceGameState {
        return SimpleChoiceGameState.deserializeFromServer(this, data);
    }
}

export interface SerializedReekAbilityGameState {
    type: "doran-martell-ability";
    childGameState: SerializedSimpleChoiceGameState;
}
