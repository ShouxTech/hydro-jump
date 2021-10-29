import { KnitClient as Knit } from '@rbxts/knit';
import { Players, Workspace } from '@rbxts/services';

const GameService = Knit.GetService('GameService');

const localPlayer = Players.LocalPlayer;
const playerGUI = localPlayer.WaitForChild('PlayerGui') as PlayerGui;

const menuGUI = playerGUI.WaitForChild('MenuGUI') as PlayerGui['MenuGUI'];
const mainFrame = menuGUI.MainFrame;
const startBtn = mainFrame.StartBtn;

declare global {
    interface KnitControllers {
        MenuController: typeof MenuController;
    }
}

const MenuController = Knit.CreateController({
    Name: 'MenuController',

    KnitStart() {
        if (!Workspace.CurrentCamera) {
            Workspace.GetPropertyChangedSignal('CurrentCamera').Wait();
        }

        const camera = Workspace.CurrentCamera!;
        camera.CameraType = Enum.CameraType.Scriptable;
        camera.CameraSubject = Workspace.CameraStart;
        camera.CFrame = Workspace.CameraStart.CFrame;

        startBtn.MouseButton1Click.Connect(() => {
            GameService.StartGame.Fire();
        });

        GameService.StartGame.Connect(() => {
            menuGUI.Enabled = false;
        });

        GameService.EndGame.Connect(() => {
            menuGUI.Enabled = true;
        });
    },

    KnitInit() {
        
    }
});