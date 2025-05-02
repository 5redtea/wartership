/*:
 * @target MZ
 * @plugindesc 精确强制攻击ID=7角色
 */
(() => {
    // 保存原始方法
    const _Game_Action_evaluate = Game_Action.prototype.evaluate;
    
    Game_Action.prototype.evaluate = function() {
        // 仅处理敌人技能（假设敌人技能ID为10）
        if (this.subject().isEnemy() && this.item().id === 10) {
            // 查找我方ID=7的存活角色
            const target7 = $gameParty.members().find(actor => 
                actor.actorId() === 7 && actor.isAlive());
            
            if (target7) {
                // 强制设置目标
                this._targetIndex = $gameParty.members().indexOf(target7);
                this._targets = [target7];
            }
        }
        return _Game_Action_evaluate.call(this);
    };
})();