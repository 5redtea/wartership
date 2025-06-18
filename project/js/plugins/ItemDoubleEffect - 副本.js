/*:
 * @target MZ
 * @plugindesc 使状态45的角色使用道具时对友方效果1.5倍+全体化（修正版）
 * @author 你的名字
 * 
 * @help
 * 已修复效果不生效的问题，现在效果为1.5倍+全体化
 */

(() => {
    'use strict';
    
    const STATE_ID = 45; // 要监控的状态ID
    
    // 存储原始方法
    const _Game_Action_applyItemEffect = Game_Action.prototype.applyItemEffect;
    const _Game_Action_targets = Game_Action.prototype.targetsForFriends;
    
    // 修改目标选择（全体化）
    Game_Action.prototype.targetsForFriends = function() {
        return this.isSpecialEffectActive() 
            ? this.friendsUnit().aliveMembers() 
            : _Game_Action_targets.call(this);
    };
    
    // 修改效果应用（1.5倍）
    Game_Action.prototype.applyItemEffect = function(target, effect) {
        if (this.isSpecialEffectActive()) {
            // 创建效果副本
            const modifiedEffect = Object.assign({}, effect);
            
            // 应用1.5倍效果（四舍五入）
            if (modifiedEffect.value !== 0) {
                modifiedEffect.value = Math.round(modifiedEffect.value * 1.5);
                console.log(`[效果增强] 原始值: ${effect.value} → 增强后: ${modifiedEffect.value}`);
            }
            
            _Game_Action_applyItemEffect.call(this, target, modifiedEffect);
        } else {
            _Game_Action_applyItemEffect.call(this, target, effect);
        }
    };
    
    // 判断条件
    Game_Action.prototype.isSpecialEffectActive = function() {
        const active = (
            this.subject() && 
            this.subject().isStateAffected(STATE_ID) &&
            this.isItem() &&
            this.isForFriend()
        );
        
        if (active) {
            console.log(`[特效激活] 道具ID: ${this.item().id}, 名称: ${this.item().name}`);
        }
        return active;
    };
    
    console.log(`[状态${STATE_ID}特效] 插件已加载 - 1.5倍效果+全体化`);
})();