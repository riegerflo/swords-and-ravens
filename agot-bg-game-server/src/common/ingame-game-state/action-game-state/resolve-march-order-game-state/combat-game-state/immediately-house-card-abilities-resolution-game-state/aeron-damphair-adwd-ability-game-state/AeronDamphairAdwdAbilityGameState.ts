import GameState from "../../../../../../GameState";
import ImmediatelyHouseCardAbilitiesResolutionGameState from "../ImmediatelyHouseCardAbilitiesResolutionGameState";
import Game from "../../../../../game-data-structure/Game";
import CombatGameState from "../../CombatGameState";
import House from "../../../../../game-data-structure/House";
import Player from "../../../../../Player";
import {ClientMessage} from "../../../../../../../messages/ClientMessage";
import {ServerMessage} from "../../../../../../../messages/ServerMessage";
import IngameGameState from "../../../../../IngameGameState";
import BiddingGameState, { SerializedBiddingGameState } from "../../../../../westeros-game-state/bidding-game-state/BiddingGameState";

export default class AeronDamphairAdwdAbilityGameState extends GameState<
    ImmediatelyHouseCardAbilitiesResolutionGameState["childGameState"],
    BiddingGameState<AeronDamphairAdwdAbilityGameState>> {

    combatStrengthModifier: number = 2; 

    get game(): Game {
        return this.parentGameState.game;
    }

    get combatGameState(): CombatGameState {
        return this.parentGameState.combatGameState;
    }

    get ingame(): IngameGameState {
        return this.parentGameState.parentGameState.parentGameState.ingameGameState;
    }

    onBiddingGameStateEnd(results: [number, House[]][]): void {
        const house = this.game.houses.get("greyjoy")
        this.combatStrengthModifier = results[0][0]

        this.ingame.log({
            type: "aeron-adwd-bid",
            house: house.name,
            powerTokens: this.combatStrengthModifier
        });

        this.entireGame.broadcastToClients({
            type: "change-house-card-strength",
            house: house.id,
            strength: this.combatStrengthModifier
        });

        this.parentGameState.onHouseCardResolutionFinish(house);

    }

    firstStart(house: House): void {
        // If the house doesn't have 2 power tokens, or doesn't have other available
        // house cards, don't even ask him.
        console.log("Running AeronDamphairAbilityGameState.firstStart")
        if (house.powerTokens < 0) {
            return ;
        }
        this.setChildGameState(new BiddingGameState(this)).firstStart([house]);
    }

    onPlayerMessage(player: Player, message: ClientMessage): void {
        this.childGameState.onPlayerMessage(player, message);
    }

    onServerMessage(message: ServerMessage): void {
        this.childGameState.onServerMessage(message);
    }

    serializeToClient(admin: boolean, player: Player | null): SerializedAeronDamphairAdwdAbilityGameState {
        console.log("Serializing AeronDamphairAbilityGameState to client")
        return {
            type: "aeron-damphair-adwd-ability",
            childGameState: this.childGameState.serializeToClient(admin, player)
        };
    }

    static deserializeFromServer(houseCardResolution: ImmediatelyHouseCardAbilitiesResolutionGameState["childGameState"], data: SerializedAeronDamphairAdwdAbilityGameState): AeronDamphairAdwdAbilityGameState {
        console.log("Deserializing AeronDamphairAbilityGameState from Server")
        const aeronDamphairAdwdAbilityGameState = new AeronDamphairAdwdAbilityGameState(houseCardResolution);

        aeronDamphairAdwdAbilityGameState.childGameState = aeronDamphairAdwdAbilityGameState.deserializeChildGameState(data.childGameState);

        return aeronDamphairAdwdAbilityGameState;
    }

    deserializeChildGameState(data: SerializedAeronDamphairAdwdAbilityGameState["childGameState"]): AeronDamphairAdwdAbilityGameState["childGameState"] {
            return BiddingGameState.deserializeFromServer(this, data);
    }
}

export interface SerializedAeronDamphairAdwdAbilityGameState {
    type: "aeron-damphair-adwd-ability";
    childGameState: SerializedBiddingGameState;
}
