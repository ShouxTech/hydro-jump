import { CollectionService, Workspace } from "@rbxts/services";

const IGNORE_TAG = 'RayIgnore';

export class Raycast {
    public static cast(startPos: Vector3, direction: Vector3, ignoreList: Instance[], ignoreWater = false, collisionGroup?: string) {
        const maxDistance = direction.Magnitude;
        const maxDistanceIncremented = maxDistance + 0.1; // Increment is required so the ray can pass maxDistance.
        direction = direction.Unit;
        let lastPosition = startPos;
        let distance = 0;
        ignoreList = ignoreList || {};
    
        let raycastResult;
    
        const raycastParams = new RaycastParams();
        raycastParams.FilterType = Enum.RaycastFilterType.Blacklist;
        raycastParams.FilterDescendantsInstances = ignoreList;
        raycastParams.IgnoreWater = ignoreWater;
        if (collisionGroup !== undefined) {
            raycastParams.CollisionGroup = collisionGroup;
        }
    
        while (distance < maxDistance && !raycastResult) {
            raycastResult = Workspace.Raycast(lastPosition, direction.mul(maxDistanceIncremented - distance), raycastParams);
            if (raycastResult) {
                const hit = raycastResult.Instance;
                const position = raycastResult.Position;
                if (!hit.CanCollide || CollectionService.HasTag(hit, IGNORE_TAG)) {
                    ignoreList.push(hit);
                    raycastParams.FilterDescendantsInstances = ignoreList;
                    raycastResult = undefined;
                }
                distance = (startPos.sub(position)).Magnitude;
                lastPosition = position;
            } else {
                break;
            }
        }
    
        return raycastResult;
    }

    public static castWithWhitelist(startPos: Vector3, direction: Vector3, raycastParams: RaycastParams) {
        return Workspace.Raycast(startPos, direction, raycastParams);
    }
}