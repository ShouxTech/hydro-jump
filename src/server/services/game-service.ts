import { KnitServer as Knit, RemoteSignal } from '@rbxts/knit';
import { ServerStorage, Workspace } from '@rbxts/services';

const floatyPrefab = ServerStorage.Models.Floaty;
const floatySpawn = Workspace.FloatySpawn;

const obstacles = ServerStorage.Models.Obstacles;
const obstacleSpawn = Workspace.ObstacleSpawn;

let gameTag = 0;

declare global {
    interface KnitServices {
        GameService: typeof GameService;
    }
}

const GameService = Knit.CreateService({
	Name: 'GameService',

	Client: {
		StartGame: new RemoteSignal<() => void>(),
		EndGame: new RemoteSignal<() => void>()
	},

    getRandomObstacleSpawnPosition(): Vector3 {
        return obstacleSpawn.Position.add(new Vector3(math.random(-15, 15), 0, 0));
    },

    deployObstacle() {
        const obstacle = obstacles.GetChildren()[math.random(0, obstacles.GetChildren().size() - 1)].Clone() as BasePart;
        obstacle.Position = this.getRandomObstacleSpawnPosition();
        obstacle.Parent = Workspace.Obstacles;

        const bodyVelocity = obstacle.FindFirstChild('BodyVelocity') as BodyVelocity;
        bodyVelocity.Velocity = new Vector3(0, 0, obstacle.GetMass() * -1.9);

        coroutine.wrap(() => {
            task.wait(2.5);
            obstacle.Destroy();
        })();
    },

    startGame(player: Player) {
        player.LoadCharacter();

        const char = player.Character!;
        const humanoid = char.WaitForChild('Humanoid') as Humanoid;
        const rootPart = char.WaitForChild('HumanoidRootPart') as BasePart;

        humanoid.WalkSpeed = 0;
        humanoid.JumpPower = 0;

        const floaty = floatyPrefab.Clone();
        floaty.CFrame = floatySpawn.CFrame;
        floaty.Parent = char;

        const seat = floaty.Seat;
        seat.Sit(humanoid);
        
        const bodyGyro = new Instance('BodyGyro');
        bodyGyro.Parent = rootPart;

        this.Client.StartGame.Fire(player);

        const thisGameTag = gameTag + 1;
        gameTag = thisGameTag;

        while (gameTag === thisGameTag) {
            this.deployObstacle();
            task.wait(0.8);
        }
    },

    endGame(player: Player) {
        gameTag = gameTag + 1;
        for (const obstacle of Workspace.Obstacles.GetChildren()) {
            obstacle.Destroy();
        }
        this.Client.EndGame.Fire(player);
        player.Character?.Destroy();
    },

	KnitStart() {
		this.Client.StartGame.Connect((player) => {
            this.startGame(player);
        });
	},

	KnitInit() {
		math.randomseed(tick());
	},
});

export = GameService;