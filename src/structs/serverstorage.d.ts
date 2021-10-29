interface ServerStorage extends Instance {
	Models: Folder & {
		Floaty: Floaty;
		Obstacles: Folder & {
			Duck: BasePart;
		};
	};
}