import GameState from "../../../../../../../GameState";
import AfterWinnerDeterminationGameState from "../AfterWinnerDeterminationGameState";
import Game from "../../../../../../game-data-structure/Game";
import Player from "../../../../../../Player";
import {ClientMessage} from "../../../../../../../../messages/ClientMessage";
import {ServerMessage} from "../../../../../../../../messages/ServerMessage";
import House from "../../../../../../game-data-structure/House";
import CombatGameState from "../../../CombatGameState";
import _ from "lodash";
import IngameGameState from "../../../../../../IngameGameState";
import SimpleChoiceGameState, {SerializedSimpleChoiceGameState} from "../../../../../../simple-choice-game-state/SimpleChoiceGameState";

export default class GerrisDrinkwaterAbilityGameState extends GameState<
    AfterWinnerDeterminationGameState["childGameState"],
    SimpleChoiceGameState > {
    get game(): Game {
        return this.parentGameState.game;
    }

    get combatGameState(): CombatGameState {
        return this.parentGameState.combatGameState;
    }

    get ingame(): IngameGameState {
        return this.parentGameState.parentGameState.parentGameState.parentGameState.ingameGameState;
    }

    firstStart(house: House): void {
        this.setChildGameState(new SimpleChoiceGameState(this))
                .firstStart(
                    house,
                    "",
                    ["Iron Throne", "Fiefdoms", "King's Court"]
                );
    }

    onSimpleChoiceGameStateEnd(choice: number): void {
        const house = this.childGameState.house;

        // Put the house one position higher on the influence track
        const influenceTrack = this.game.getInfluenceTrackByI(choice);
        const houseIdx = influenceTrack.indexOf(house);
        const newIdx = (houseIdx) > 0 ? (houseIdx - 1) : 0;

        const newInfluenceTrack = _.without(influenceTrack, house);
        newInfluenceTrack.splice(newIdx, 0, house);

        this.game.setInfluenceTrack(choice, newInfluenceTrack);

        this.ingame.log({
            type: "gerris-used",
            house: this.childGameState.house.id,
            influenceTrack: choice
        });

        this.parentGameState.entireGame.broadcastToClients({
            type: "change-tracker",
            trackerI: choice,
            tracker: newInfluenceTrack.map(h => h.id)
        });

        this.parentGameState.onHouseCardResolutionFinish(this.childGameState.house);
    }

    onPlayerMessage(player: Player, message: ClientMessage): void {
        this.childGameState.onPlayerMessage(player, message);
    }

    onServerMessage(message: ServerMessage): void {
        this.childGameState.onServerMessage(message);
    }

    serializeToClient(admin: boolean, player: Player | null): SerializedGerrisDrinkwaterAbilityGameState {
        return {
            type: "gerris-drinkwater-ability",
            childGameState: this.childGameState.serializeToClient(admin, player)
        };
    }

    static deserializeFromServer(houseCardResolution:AfterWinnerDeterminationGameState["childGameState"], data: SerializedGerrisDrinkwaterAbilityGameState): GerrisDrinkwaterAbilityGameState {
        const doranMartellAbilityGameState = new GerrisDrinkwaterAbilityGameState(houseCardResolution);

        doranMartellAbilityGameState.childGameState = doranMartellAbilityGameState.deserializeChildGameState(data.childGameState);

        return doranMartellAbilityGameState;
    }

    deserializeChildGameState(data: SerializedGerrisDrinkwaterAbilityGameState["childGameState"]): SimpleChoiceGameState {
        return SimpleChoiceGameState.deserializeFromServer(this, data);
    }
}

export interface SerializedGerrisDrinkwaterAbilityGameState {
    type: "gerris-drinkwater-ability";
    childGameState: SerializedSimpleChoiceGameState;
}
