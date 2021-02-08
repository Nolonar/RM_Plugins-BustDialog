# N_BustDialog
Lets you use busts for dialogs instead of faces.

![Screenshot](busts.png)

| Project      | Latest release      |
| ------------ | ------------------- |
| N_BustDialog | [Download][release] |

[All RPG Maker plugins by Nolonar][hub]

## How to use
1. Use `Add actor` plugin command to add a bust. Ensure that each bust has its own unique name. If a bust with the same name has already been added, the new bust will not be added. You must remove the bust or clear all busts before you can add the new one.
2. (optional) Use `Move actor` plugin command to have a bust move to a new position. The name must match the one defined when adding the bust.
3. (optional) Use `Remove actor` plugin command to get rid of a specific bust. The name must match the one defined when adding the bust.
4. (optional) Use `Clear` plugin command to remove all busts.

The busts will automatically be cleared when the event ends, so there's no need to use the `Clear` plugin command unless you want to clear early.

This plugin can display up to 4 busts: 1 per side and position.
- There are 2 sides:
  - Left
  - Right
- and 2 positions per side:
  - Back
  - Front

![Sides and positions](busts_side_position.png)

If you add or move a bust to a side and position that is already occupied by another bust, the old bust will be hidden until the new bust is removed or moves away, or the old bust is moved to any side/position.

By default, the busts will be facing the center of the screen, but can be flipped to face the edge instead:

![Facing directions](busts_facing.png)

For this to work properly, the plugin needs to know the busts' alignment, i.e. whether the bust images are left-facing or right-facing.
- Left-facing means the bust is looking to the left. In the above screenshot, there is 1 left-facing busts.
- Right-facing means the bust is looking to the right. In the avoce screenshot, there are 3 right-facing bust.

The alignment can only be set plugin-wide, so all busts must be facing the same direction. The plugin will automatically flip them according to their side and whether they're supposed to be flipped.

This plugin will automatically change the tone of the busts depending on whether they're talking or not. For this to work, the name for the `Show Text...` event command must match the one defined when adding the bust.

## Compatibility
Tested and confirmed working:
- RPG Maker MZ

## Terms of Use
According to [LICENSE](LICENSE).


  [hub]: https://github.com/Nolonar/RM_Plugins
  [release]: https://github.com/Nolonar/RM_Plugins-BustDialog/releases/latest/download/N_BustDialog.js
