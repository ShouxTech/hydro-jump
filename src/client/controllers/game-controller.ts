import { KnitClient as Knit } from '@rbxts/knit';
import { ContextActionService, Players, ReplicatedStorage, UserInputService } from '@rbxts/services';
import { Raycast } from 'shared/raycast';

const GameService = Knit.GetService('GameService');

const localPlayer = Players.LocalPlayer;

const animation = ReplicatedStorage.Animations.Laying;
let animationTrack: AnimationTrack;

let jumpDebounce = false;
let gameOn = false;

declare global {
    interface KnitControllers {
        GameController: typeof GameController;
    }
}

const GameController = Knit.CreateController({
    Name: 'GameController',

    start() {
        gameOn = true;

        const char = localPlayer.Character as Model;
        const humanoid = char.FindFirstChild('Humanoid') as Humanoid;
        if (!humanoid) return;

        const animator = humanoid.FindFirstChild('Animator') as Animator;
        if (!animator) return;

        animationTrack = animator.LoadAnimation(animation);
        animationTrack.Play();
    },

    KnitStart() {
        GameService.StartGame.Connect(() => {
            this.start();
        });
        GameService.EndGame.Connect(() => {
            gameOn = false;
        });
    },

    KnitInit() {
        ContextActionService.BindAction('FloatyJump', (actionName, state, inputObject) => {
            if (!gameOn || jumpDebounce) return;

            if (state === Enum.UserInputState.Begin) {
                const floaty = localPlayer.Character!.FindFirstChild('Floaty') as Floaty;
                const raycastResult = Raycast.cast(floaty.Position, new Vector3(0, -3, 0), [localPlayer.Character!]);
                if (!raycastResult) return;

                jumpDebounce = true;
                floaty.ApplyImpulse(new Vector3(0, floaty.GetMass() * 70, 0));
                task.wait(0.1);
                jumpDebounce = false;
            }
        }, false, Enum.KeyCode.Space);

        ContextActionService.BindAction('FloatyLeft', (actionName, state, inputObject) => {
            if (!gameOn) return;

            const floaty = localPlayer.Character!.FindFirstChild('Floaty') as Floaty;

            if (state === Enum.UserInputState.Begin) {
                floaty.BodyVelocity.Velocity = new Vector3(floaty.GetMass() * 25, 0, 0);
            } else if (state === Enum.UserInputState.End) {
                if (UserInputService.IsKeyDown(Enum.KeyCode.D)) return;
                floaty.BodyVelocity.Velocity = new Vector3(0, 0, 0);
            }
        }, false, Enum.KeyCode.A);

        ContextActionService.BindAction('FloatyRight', (actionName, state, inputObject) => {
            if (!gameOn) return;

            const floaty = localPlayer.Character!.FindFirstChild('Floaty') as Floaty;

            if (state === Enum.UserInputState.Begin) {
                floaty.BodyVelocity.Velocity = new Vector3(floaty.GetMass() * -25, 0, 0);
            } else if (state === Enum.UserInputState.End) {
                if (UserInputService.IsKeyDown(Enum.KeyCode.A)) return;
                floaty.BodyVelocity.Velocity = new Vector3(0, 0, 0);
            }
        }, false, Enum.KeyCode.D);
    }
});