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
import ActionGameState from "../../../../../ActionGameState";
import SelectUnitsGameState, {SerializedSelectUnitsGameState} from "../../../../../../select-units-game-state/SelectUnitsGameState";
import Region from "../../../../../../game-data-structure/Region";
import Unit from "../../../../../../game-data-structure/Unit";
import {footman} from "../../../../../../game-data-structure/unitTypes";

export default class SerIlynPayneAbilityGameState extends GameState<
    AfterWinnerDeterminationGameState["childGameState"],
    SelectUnitsGameState<SerIlynPayneAbilityGameState>> {
    get game(): Game {
        return this.parentGameState.game;
    }

    get combatGameState(): CombatGameState {
        return this.parentGameState.combatGameState;
    }

    get ingame(): IngameGameState {
        return this.parentGameState.parentGameState.parentGameState.parentGameState.ingameGameState;
    }

    get actionGameState(): ActionGameState {
        return this.combatGameState.actionGameState;
    }

    firstStart(house: House): void {
        const enemy = this.combatGameState.getEnemy(house);
        const availableFootmen = this.getAllFootmen(house);

        if (availableFootmen.length == 0) {
            this.ingame.log({
                type: "ser-ilyn-payne-no-footman-available",
                house: house.id
            });

            this.parentGameState.onHouseCardResolutionFinish(house);
        } else if (this.combatGameState.areCasulatiesPrevented(enemy)) {
            this.ingame.log({
                type: "ser-ilyn-payne-casualties-prevented",
                house: house.id
            });

            this.parentGameState.onHouseCardResolutionFinish(house);
        } else {
            this.setChildGameState(new SelectUnitsGameState(this)).firstStart(
                house,
                availableFootmen,
                1
            );
        }
    }

    onSelectUnitsEnd(house: House, selectedUnits: [Region, Unit[]][]): void {
        const enemy = this.combatGameState.getEnemy(house);
        // There will only be one footman in "selectedUnit",
        // but the following code deals with the multiple units present.
        selectedUnits.forEach(([region, units]) => {
            // Remove them from the regions as well as from the army of the opponent
            const houseCombatData = this.combatGameState.houseCombatDatas.get(enemy);
            houseCombatData.army = _.without(houseCombatData.army, ...units);

            units.forEach(unit => {
                region.units.delete(unit.id);
            });

            console.log("Unit size:", region.units.size)

            if (region.units.size == 0) {
            this.actionGameState.ordersOnBoard.delete(region);

            this.actionGameState.entireGame.broadcastToClients({
                type: "action-phase-change-order",
                region: region.id,
                order: null

            });
            }

            this.entireGame.broadcastToClients({
                type: "combat-change-army",
                region: region.id,
                house: enemy.id,
                army: houseCombatData.army.map(u => u.id)
            });

            this.entireGame.broadcastToClients({
                type: "remove-units",
                regionId: region.id,
                unitIds: units.map(u => u.id)
            });

            this.ingame.log({
                type: "ser-ilyn-payne-footman-killed",
                house: house.id,
                region: region.id
            });
        });

        this.parentGameState.onHouseCardResolutionFinish(house);
    }

    getAllFootmen(house: House): Unit[] {
        return _.flatMap(
            this.game.world.getControlledRegions(this.combatGameState.getEnemy(house))
                .map(u => u.units.values.filter(u => u.type == footman))
        );
    }

    onPlayerMessage(player: Player, message: ClientMessage): void {
        this.childGameState.onPlayerMessage(player, message);
    }

    onServerMessage(message: ServerMessage): void {
        this.childGameState.onServerMessage(message);
    }

    serializeToClient(admin: boolean, player: Player | null): SerializedSerIlynPayneAbilityGameState {
        return {
            type: "ser-ilyn-payne-ability",
            childGameState: this.childGameState.serializeToClient(admin, player)
        };
    }

    static deserializeFromServer(houseCardResolution: AfterWinnerDeterminationGameState["childGameState"], data: SerializedSerIlynPayneAbilityGameState): SerIlynPayneAbilityGameState {
        const maceTyrellAbilityGameState = new SerIlynPayneAbilityGameState(houseCardResolution);

        maceTyrellAbilityGameState.childGameState = maceTyrellAbilityGameState.deserializeChildGameState(data.childGameState);

        return maceTyrellAbilityGameState;
    }

    deserializeChildGameState(data: SerializedSerIlynPayneAbilityGameState["childGameState"]): SerIlynPayneAbilityGameState["childGameState"] {
        return SelectUnitsGameState.deserializeFromServer(this, data);
    }
}

export interface SerializedSerIlynPayneAbilityGameState {
    type: "ser-ilyn-payne-ability";
    childGameState: SerializedSelectUnitsGameState;
}

