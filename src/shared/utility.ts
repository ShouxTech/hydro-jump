import { Workspace } from '@rbxts/services';

export class Utility {
    public static getCharacterFromInstance(instance: Instance): Model | undefined {
        let parent = instance.Parent;
        if ((instance === Workspace) || !instance.IsDescendantOf(Workspace) || !parent) return;

        while (parent !== Workspace) {
            if (parent?.FindFirstChildOfClass('Humanoid') && parent?.FindFirstChild('HumanoidRootPart')) {
                return parent as Model;
            } else {
                parent = parent?.Parent;
            }
        }
    }
}