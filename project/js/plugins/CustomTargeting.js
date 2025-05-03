/*:
 * @target MZ
 * @plugindesc 强制敌人技能攻击指定ID角色
 * @author YourName
 */

(() => {
    // 保存原始目标选择方法
    const _Game_Action_targetsForOpponents = Game_Action.prototype.targetsForOpponents;
    
    // 重写目标选择方法
    Game_Action.prototype.targetsForOpponents = function() {
        // 如果是特定技能（假设技能ID为10）
        if (this.item().id === 95) {
            // 获取所有存活敌人
            const unit = this.opponentsUnit();
            const aliveMembers = unit.aliveMembers();
            
            // 查找ID=7的角色
            const target7 = aliveMembers.find(actor => {
                // 注意：敌人查找的是敌人单位，这里需要调整为查找我方角色
                // 对于我方角色需要使用 $gameParty.members()
                return false; // 这里需要修改
            });
            
            // 正确查找我方ID=7角色的方法
            const myTarget7 = $gameParty.members().find(actor => 
                actor.actorId() === 7 && actor.isAlive());
                
            if (myTarget7) {
                // 返回包含目标7的数组
                return [myTarget7];
            }
        }
        
        // 其他情况使用默认逻辑
        return _Game_Action_targetsForOpponents.call(this);
    };
})();