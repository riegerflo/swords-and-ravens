import {observer} from "mobx-react";
import GameStateComponentProps from "../GameStateComponentProps";
import {Component, ReactNode} from "react";
import ImmediatelyHouseCardAbilitiesResolutionGameState
    from "../../../common/ingame-game-state/action-game-state/resolve-march-order-game-state/combat-game-state/immediately-house-card-abilities-resolution-game-state/ImmediatelyHouseCardAbilitiesResolutionGameState";
import renderChildGameState from "../../utils/renderChildGameState";
import QueenOfThornsAbilityGameState
    from "../../../common/ingame-game-state/action-game-state/resolve-march-order-game-state/combat-game-state/immediately-house-card-abilities-resolution-game-state/queen-of-thorns-ability-game-state/QueenOfThornsAbilityGameState";
import QueenOfThornsAbilityComponent from "./QueenOfThornsAbilityComponent";
import DoranMartellAbilityGameState
    from "../../../common/ingame-game-state/action-game-state/resolve-march-order-game-state/combat-game-state/immediately-house-card-abilities-resolution-game-state/doran-martell-ability-game-state/DoranMartellAbilityGameState";
import DoranMartellAbilityComponent from "./DoranMartellAbilityComponent";
import ReekAbilityGameState
    from "../../../common/ingame-game-state/action-game-state/resolve-march-order-game-state/combat-game-state/immediately-house-card-abilities-resolution-game-state/reek-ability-game-state/ReekAbilityGameState";
import ReekAbilityComponent from "./ReekAbilityComponent";
import AeronDamphairAbilityGameState
    from "../../../common/ingame-game-state/action-game-state/resolve-march-order-game-state/combat-game-state/immediately-house-card-abilities-resolution-game-state/aeron-damphair-ability-game-state/AeronDamphairAbilityGameState";
import AeronDamphairAbilityComponent from "./AeronDamphairAbilityComponent";
import MaceTyrellAbilityGameState
    from "../../../common/ingame-game-state/action-game-state/resolve-march-order-game-state/combat-game-state/immediately-house-card-abilities-resolution-game-state/mace-tyrell-ability-game-state/MaceTyrellAbilityGameState";
import MaceTyrellAbilityComponent from "./MaceTyrellAbilityComponent";


@observer
export default class ImmediatelyHouseCardAbilitiesResolutionComponent extends Component<GameStateComponentProps<ImmediatelyHouseCardAbilitiesResolutionGameState>> {
    render(): ReactNode {
        return renderChildGameState({...this.props, gameState: this.props.gameState.childGameState}, [
            [QueenOfThornsAbilityGameState, QueenOfThornsAbilityComponent],
            [DoranMartellAbilityGameState, DoranMartellAbilityComponent],
            [AeronDamphairAbilityGameState, AeronDamphairAbilityComponent],
            [MaceTyrellAbilityGameState, MaceTyrellAbilityComponent],
            [ReekAbilityGameState, ReekAbilityComponent]
        ]);
    }
}
