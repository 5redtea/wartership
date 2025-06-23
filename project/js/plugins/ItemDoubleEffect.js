/*:
 * @target MZ
 * @plugindesc 使状态45的角色使用道具时对友方效果全体化（包括复活类道具）
 * @author 你的名字
 * 
 * @help
 * 功能：
 * 1. 当角色拥有状态45时，使用对友方道具效果会全体化
 * 2. 如果选中死亡角色，则改为对所有死亡角色生效
 * 状态ID硬编码为45
 */

(() => {
    'use strict';
    
    const STATE_ID = 45; // 监控的状态ID
    
    // 存储原始目标选择方法
    const _Game_Action_targets = Game_Action.prototype.targetsForFriends;
    
    // 修改目标选择方法（实现全体化）
    Game_Action.prototype.targetsForFriends = function() {
        // 检查是否满足条件
        if (this.subject() && 
            this.subject().isStateAffected(STATE_ID) &&
            this.isItem() &&
            this.isForFriend()) {
            
            const unit = this.friendsUnit();
            const originalTargets = _Game_Action_targets.call(this);
            
            // 检查原始目标中是否有死亡角色
            const hasDeadTarget = originalTargets.some(target => target.isDead());
            
            if (hasDeadTarget) {
                // 如果目标是死亡角色，则选择所有死亡角色
                console.log(`[全体化生效-复活] 道具: ${this.item().name}`);
                return unit.deadMembers();
            } else {
                // 否则选择所有存活角色
                console.log(`[全体化生效-治疗] 道具: ${this.item().name}`);
                return unit.aliveMembers();
            }
        }
        
        // 不满足条件时使用原始逻辑
        return _Game_Action_targets.call(this);
    };
    
    console.log(`[状态${STATE_ID}全体化插件] 已加载`);
})();