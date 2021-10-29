import { KnitServer as Knit, Component } from '@rbxts/knit';

const modules = (script.Parent!.FindFirstChild('services') as Folder).GetDescendants();
for (const module of modules) {
    if (module.IsA('ModuleScript')) {
        require(module);
    }
}

Knit.Start()
    .then(() => {
        Component.Auto(script.Parent!.FindFirstChild('components') as Folder);
    })
    .catch(warn);