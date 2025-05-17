/*:
 * @target MZ
 * @plugindesc 限制队伍为4人并实现替换机制
 * @author YourName
 */

(function() {
    // 设置最大队伍人数为4
    $gameParty._maxMembers = 4;
    
    // 存储待加入的角色ID
    $gameTemp._reserveAddActor = null;

    // 覆盖默认的addActor方法
    Game_Party.prototype.addActor = function(actorId) {
        if (this._actors.includes(actorId)) return false;
        
        if (this._actors.length >= this._maxMembers) {
            $gameTemp._reserveAddActor = actorId;
            SceneManager.push(Scene_PartyReplace);
            return false;
        }
        
        this._actors.push(actorId);
        $gamePlayer.refresh();
        return true;
    };

    // 替换场景
    function Scene_PartyReplace() {
        this.initialize.apply(this, arguments);
    }

    Scene_PartyReplace.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_PartyReplace.prototype.constructor = Scene_PartyReplace;

    Scene_PartyReplace.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_PartyReplace.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createWindowLayer();
        this.createCommandWindow();
    };

    // 定义窗口矩形区域
    Scene_PartyReplace.prototype.commandWindowRect = function() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(4, true);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_PartyReplace.prototype.createCommandWindow = function() {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_PartyReplace(rect);
        this._commandWindow.setHandler("ok", this.onReplaceOk.bind(this));
        this._commandWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    };

    Scene_PartyReplace.prototype.onReplaceOk = function() {
        const index = this._commandWindow.index();
        $gameParty._actors[index] = $gameTemp._reserveAddActor;
        $gameTemp._reserveAddActor = null;
        $gamePlayer.refresh();
        this.popScene();
    };

    // 替换成员选择窗口
    function Window_PartyReplace() {
        this.initialize.apply(this, arguments);
    }

    Window_PartyReplace.prototype = Object.create(Window_Command.prototype);
    Window_PartyReplace.prototype.constructor = Window_PartyReplace;

    Window_PartyReplace.prototype.initialize = function(rect) {
        Window_Command.prototype.initialize.call(this, rect);
        this.refresh();
    };

    Window_PartyReplace.prototype.makeCommandList = function() {
        for (let i = 0; i < $gameParty.size(); i++) {
            const actor = $gameParty.members()[i];
            this.addCommand(actor.name(), 'replace');
        }
    };

    Window_PartyReplace.prototype.drawItem = function(index) {
        const rect = this.itemLineRect(index);
        const actor = $gameParty.members()[index];
        this.drawActorFace(actor, rect.x + 2, rect.y + 2, 144, 144);
        this.drawActorSimpleStatus(actor, rect.x + 148, rect.y + rect.height / 4);
    };
})();