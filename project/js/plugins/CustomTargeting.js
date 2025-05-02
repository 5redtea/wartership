// 保存原始方法
var _Game_Action_apply = Game_Action.prototype.apply;

// 重写技能应用方法
Game_Action.prototype.apply = function(target) {
    // 如果是特定技能
    if (this.item().id === 95) {
        // 查找ID=7的角色
        var target7 = this.opponentsUnit().aliveMembers().find(actor => {
            return actor.actorId() === 0007;
        });
        if (target7) {
            // 强制修改目标为ID=7的角色
            this._targetIndex = target7.index();
        }
    }
    // 调用原始方法
    return _Game_Action_apply.call(this, target);
};