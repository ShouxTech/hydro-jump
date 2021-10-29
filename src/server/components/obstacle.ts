import { Component, Janitor } from '@rbxts/knit';
import { Players } from '@rbxts/services';
import GameService from 'server/services/game-service';
import { Utility } from 'shared/utility';

class Obstacle implements Component.ComponentClass {
    public static Tag = 'Obstacle';

    private janitor = new Janitor();

    constructor(obstacle: BasePart) {
        this.janitor.Add(
            obstacle.Touched.Connect((hit) => {
                this.touched(hit);
            })
        );
    }

    private touched(hit: BasePart) {
        const charHit = Utility.getCharacterFromInstance(hit);
        if (!charHit) return;

        const player = Players.GetPlayerFromCharacter(charHit)!;
        GameService.endGame(player);
    }

    public Destroy() {
        this.janitor.Destroy();
    }
}

export = Obstacle;