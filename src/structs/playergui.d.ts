interface PlayerGui extends Instance {
	MenuGUI: ScreenGui & {
		MainFrame: Frame & {
			StartBtn: TextButton & {
				UICorner: UICorner;
			};
		};
	};
}