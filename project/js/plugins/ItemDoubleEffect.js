/*:
 * @target MZ
 * @plugindesc 使状态45的角色使用道具时对友方效果全体化
 * @author 你的名字
 * 
 * @help
 * 仅实现道具效果的全体化，不修改效果值
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
            
            console.log(`[全体化生效] 道具: ${this.item().name}`);
            return this.friendsUnit().aliveMembers();
        }
        
        // 不满足条件时使用原始逻辑
        return _Game_Action_targets.call(this);
    };
    
    console.log(`[状态${STATE_ID}全体化插件] 已加载`);
})();