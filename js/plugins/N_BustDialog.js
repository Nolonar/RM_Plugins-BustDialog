/* 
 * MIT License
 * 
 * Copyright (c) 2021 Nolonar
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

//=============================================================================
// Metadata
//=============================================================================
/*:
 * @target MZ
 * @plugindesc Lets you use busts for dialogs instead of faces.
 * @author Nolonar
 * @url https://github.com/Nolonar/RM_Plugins
 * 
 * 
 * @param bustAlignment
 * @text Default bust alignment
 * @desc Whether the bust images are facing left or right.
 *       All bust images must face the same way.
 * @type select
 * @option left
 * @option right
 * @default left
 * 
 * @param bustOrigin
 * @text Bust origin
 * @desc If center, only the top half of the bust will be visible.
 *       If bottom, the heads of tall busts may render off screen.
 * @type select
 * @option center
 * @option bottom
 * @default bottom
 * 
 * @param activeTint
 * @text Active bust tint
 * @desc The tint of the bust when talking.
 * @type struct<tint>
 * @default {"r":"0","g":"0","b":"0","gray":"0"}
 * 
 * @param inactiveTint
 * @text Inactive bust tint
 * @desc The tint of the bust when not talking.
 * @type struct<tint>
 * @default {"r":"-100","g":"-100","b":"-100","gray":"0"}
 * 
 * 
 * @command addBust
 * @text Add actor
 * @desc Adds an actor's bust to the current scene.
 * 
 * @arg name
 * @text Name
 * @desc The name of the actor. This is used to determine which bust should be highlighted during dialogs.
 * @type string
 * 
 * @arg bustFile
 * @text Bust
 * @desc The bust to add to the scene.
 * @type file
 * @dir img/busts/
 * @require 1
 * 
 * @arg side
 * @text Side
 * @desc The side the bust should be added to.
 * @type select
 * @option left
 * @option right
 * @default left
 * 
 * @arg position
 * @text Position
 * @desc Whether the bust should be in front (near the center) or in the back (near the edge of the screen).
 * @type select
 * @option back
 * @option front
 * @default back
 * 
 * @arg isFlipped
 * @text Flip actor
 * @desc If ON, the actor will be facing the edge of the screen.
 *       If OFF, the actor will be facing the center instead.
 * @type boolean
 * @default false
 * 
 * 
 * @command moveBust
 * @text Move actor
 * @desc Move an actor's bust to the specified position.
 * 
 * @arg name
 * @text Name
 * @desc The name of the actor to move. This must match the name defined when adding the actor.
 * @type string
 * 
 * @arg side
 * @text Side
 * @desc The side the bust should be moved to.
 * @type select
 * @option left
 * @option right
 * @default left
 * 
 * @arg position
 * @text Position
 * @desc If not changing side, actor will switch position with another actor on the same side.
 * @type select
 * @option back
 * @option front
 * @default back
 * 
 * @arg isFlipped
 * @text Flip actor
 * @desc If ON, the actor will be facing the edge of the screen.
 *       If OFF, the actor will be facing the center instead.
 * @type boolean
 * @default false
 * 
 * @arg duration
 * @text Duration
 * @desc How long (in frames) it takes to fully animate the move
 * @type number
 * @min 0
 * @default 18
 * 
 * @arg isBlocking
 * @text Wait for completion
 * @desc ON: the event will wait until the move is complete.
 *       OFF: the event will continue without waiting.
 * @type boolean
 * @default true
 * 
 * 
 * @command removeBust
 * @text Remove actor
 * @desc Removes an actor's bust from the current scene.
 * 
 * @arg name
 * @text Name
 * @desc The name of the actor to remove.
 * 
 * 
 * @command clear
 * @text Clear
 * @desc Removes all busts from the current scene.
 * 
 * 
 * @help Version 1.0.1
 * This plugin will search for bust image files in img/busts. This folder does
 * not exist by default and must be created.
 * 
 * When a message window is shown, the name is used to highlight the bust of
 * whoever is talking. All other busts will be darkened.
 * 
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 * Add actor
 *      Adds a bust to the scene. Multiple busts can be added, but since there
 *      are only 4 possible slots for busts, only 4 can be displayed at once.
 *      If another bust has been added to the same slot, it will be hidden
 *      the newer bust has moved or been removed.
 * 
 *      Note: Do not add multiple actors with the same name. Any actor with
 *      duplicate name will be ignored.
 * 
 * Move actor
 *      Moves a bust. If the bust is not currently visible, it will become
 *      visible.
 * 
 * Remove actor
 *      Removes the bust from the scene. Once removed, busts can no longer be
 *      moved until added to the scene again.
 * 
 * Clear
 *      Removes all busts. This is equivalent to using "Remove actor" for all
 *      busts.
 */

/*~struct~tint:
 * @param r
 * @text Red
 * @type number
 * @min -255
 * @max 255
 * 
 * @param g
 * @text Green
 * @type number
 * @min -255
 * @max 255
 * 
 * @param b
 * @text Blue
 * @type number
 * @min -255
 * @max 255
 * 
 * @param gray
 * @text Gray
 * @type number
 * @min 0
 * @max 255
 */

(() => {
    const PLUGIN_NAME = "N_BustDialog";

    const OPTION_ALIGNMENT_LEFT = "left";
    const OPTION_ORIGIN_BOTTOM = "bottom";
    const OPTION_ORIGIN_CENTER = "center";

    const COMMAND_ADDBUST = "addBust";
    const COMMAND_MOVEBUST = "moveBust";
    const COMMAND_REMOVEBUST = "removeBust";
    const COMMAND_CLEAR = "clear";
    const COMMAND_ARG_SIDE_LEFT = "left";
    const COMMAND_ARG_SIDE_RIGHT = "right";
    const COMMAND_ARG_POSITION_BACK = "back";
    const COMMAND_ARG_POSITION_FRONT = "front";

    const parameters = PluginManager.parameters(PLUGIN_NAME);
    parameters.bustAlignment = parameters.bustAlignment || OPTION_ALIGNMENT_LEFT;
    parameters.bustOrigin = parameters.bustOrigin || OPTION_ORIGIN_BOTTOM;
    parameters.activeTint = parseTint(parameters.activeTint, { r: 0, g: 0, b: 0, gray: 0 });
    parameters.inactiveTint = parseTint(parameters.inactiveTint, { r: -100, g: -100, b: -100, gray: 0 });

    PluginManager.registerCommand(PLUGIN_NAME, COMMAND_ADDBUST, function (args) {
        bustManager.addBust(this, args.name, args.bustFile, ...sanitizeArgs(args));
    });
    PluginManager.registerCommand(PLUGIN_NAME, COMMAND_MOVEBUST, function (args) {
        const duration = args.duration === "0" ? 0 : Number(args.duration) || 6;
        bustManager.moveBust(args.name, ...sanitizeArgs(args), duration);
        if (args.isBlocking !== "false")
            this.wait(duration);
    });
    PluginManager.registerCommand(PLUGIN_NAME, COMMAND_REMOVEBUST, args => {
        bustManager.removeBust(args.name);
    });
    PluginManager.registerCommand(PLUGIN_NAME, COMMAND_CLEAR, () => {
        bustManager.clear();
    });

    function parseTint(string, def) {
        const tint = string ? JSON.parse(string) : def;
        return [tint.r, tint.g, tint.b, tint.gray].map(c => Number(c));
    }

    function sanitizeArgs(args) {
        return [
            args.side || COMMAND_ARG_SIDE_LEFT,
            args.position || COMMAND_ARG_POSITION_BACK,
            args.isFlipped === "true"
        ];
    }

    const bustManager = new class BustManager {
        constructor() {
            this.busts = [];
            for (const side of [COMMAND_ARG_SIDE_LEFT, COMMAND_ARG_SIDE_RIGHT]) {
                this[side] = {
                    [COMMAND_ARG_POSITION_BACK]: [],
                    [COMMAND_ARG_POSITION_FRONT]: []
                };
            }
            this.interpreters = [];
        }

        isUsedByInterpreter(interpreter) {
            return this.interpreters.some(i => i === interpreter);
        }

        findBust(name) {
            return this.busts.find(b => b.actorName === name);
        }

        addBust(interpreter, name, file, side, position, isFlipped) {
            // Remember which interpreter added busts, so we can clear them when the interpreter has finished.
            if (!this.isUsedByInterpreter(interpreter))
                this.interpreters.push(interpreter);

            // Do not add duplicate busts.
            if (this.findBust(name)) return;

            const bust = new Game_Bust(this.busts.length, name, file);
            this.busts.push(bust);
            this[side][position].push(bust);
            bust.showBust(side, position, isFlipped);
        }

        moveBust(name, side, position, isFlipped, duration) {
            const bust = this.findBust(name);
            if (!bust) return;

            this[bust.side][bust.position].remove(bust);
            this[side][position].push(bust);
            bust.moveBust(side, position, isFlipped, duration);
        }

        removeBust(name) {
            const bust = this.findBust(name);
            if (!bust) return;

            this.busts.remove(bust);
            this[bust.side][bust.position].remove(bust);
        }

        moveToForeground(bust) {
            const list = this[bust.side][bust.position];
            list.remove(bust);
            list.push(bust);
        }

        clear() {
            [COMMAND_ARG_SIDE_LEFT, COMMAND_ARG_SIDE_RIGHT].flatMap(side =>
                [COMMAND_ARG_POSITION_BACK, COMMAND_ARG_POSITION_FRONT].map(position => this[side][position])
            ).concat([this.busts]).forEach(a => a.length = 0);
        }
    }();

    class Game_Bust extends Game_Picture {
        initialize(id, name, file) {
            super.initialize();

            this.id = id;
            this.actorName = name;
            this.file = file;
            this.isTalking = true;
        }

        showBust(side, position, isFlipped) {
            this.setArguments(side, position, isFlipped);
            this.show(this.file, ...this.targetArguments);
        }

        moveBust(side, position, isFlipped, duration) {
            this.setArguments(side, position, isFlipped);
            const easing = 3;
            this.move(...this.targetArguments, duration, easing);
        }

        setArguments(side, position, isFlipped) {
            this.side = side;
            this.position = position;
            this.isFlipped = isFlipped;
        }

        get targetArguments() {
            return [
                0, // Origin (overriden and doesn't matter)
                this.targetX,
                this.targetY,
                this.targetScaleX,
                this.targetScaleY,
                255, // Opacity
                0 // Blend mode
            ];
        }

        get targetX() {
            const step = Graphics.width / 6;
            return {
                [COMMAND_ARG_SIDE_LEFT]: {
                    [COMMAND_ARG_POSITION_BACK]: 1 * step,
                    [COMMAND_ARG_POSITION_FRONT]: 2 * step
                },
                [COMMAND_ARG_SIDE_RIGHT]: {
                    [COMMAND_ARG_POSITION_FRONT]: 4 * step,
                    [COMMAND_ARG_POSITION_BACK]: 5 * step
                }
            }[this.side][this.position];
        }

        get targetY() {
            return Graphics.height;
        }

        get targetScaleX() {
            const isFlipNeeded = (this.side === parameters.bustAlignment) !== this.isFlipped;
            return isFlipNeeded ? -100 : 100;
        }

        get targetScaleY() {
            return 100;
        }
    }

    class Sprite_Bust extends Sprite_Picture {
        picture() {
            return {
                0: bustManager.left.front,
                1: bustManager.left.back,
                2: bustManager.right.front,
                3: bustManager.right.back
            }[this._pictureId].slice(-1)[0];
        }

        updateOrigin() {
            this.anchor.x = 0.5;
            this.anchor.y = {
                [OPTION_ORIGIN_BOTTOM]: 1,
                [OPTION_ORIGIN_CENTER]: 0.5
            }[parameters.bustOrigin];
        }

        updateTone() {
            const bust = this.picture();
            const tone = {
                [true]: parameters.activeTint,
                [false]: parameters.inactiveTint
            }[bust.isTalking];
            this.setColorTone(tone);
        }

        loadBitmap() {
            this.bitmap = ImageManager.loadBitmap("img/busts/", this._pictureName);
        }
    }

    const Spriteset_Base_createUpperLayer = Spriteset_Base.prototype.createUpperLayer;
    Spriteset_Base.prototype.createUpperLayer = function () {
        const rect = this.pictureContainerRect();
        const bustContainer = new Sprite();
        bustContainer.setFrame(rect.x, rect.y, rect.width, rect.height);
        for (let i = 0; i < 4; i++) {
            bustContainer.addChild(new Sprite_Bust(i));
        }
        this.addChild(bustContainer);

        Spriteset_Base_createUpperLayer.call(this);
    }

    const Game_Screen_update = Game_Screen.prototype.update;
    Game_Screen.prototype.update = function () {
        Game_Screen_update.call(this);

        bustManager.busts.forEach(b => b.update());
    };

    const Game_Message_setSpeakerName = Game_Message.prototype.setSpeakerName;
    Game_Message.prototype.setSpeakerName = function (speakerName) {
        Game_Message_setSpeakerName.call(this, speakerName);
        bustManager.busts.forEach(b => {
            b.isTalking = b.actorName === speakerName
            if (b.isTalking)
                bustManager.moveToForeground(b);
        });
    };

    const Game_Interpreter_terminate = Game_Interpreter.prototype.terminate;
    Game_Interpreter.prototype.terminate = function () {
        Game_Interpreter_terminate.call(this);
        if (bustManager.isUsedByInterpreter(this))
            bustManager.clear();
    };

    const Scene_Title_start = Scene_Title.prototype.start;
    Scene_Title.prototype.start = function () {
        Scene_Title_start.call(this);
        bustManager.reset();
    };
})();
