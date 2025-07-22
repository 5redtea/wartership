/*:
 * @target MZ
 * @plugindesc 状态50附加后立即死亡（非回合制）
 * @author YourName
 * @help 将此插件放在插件管理器最下方
 */

(() => {
    // 存储原始方法
    const _Game_Battler_addState = Game_Battler.prototype.addState;
    
    // 覆盖方法
    Game_Battler.prototype.addState = function(stateId) {
        const wasAlive = this.isAlive();
        _Game_Battler_addState.call(this, stateId);
        
        // 立即死亡逻辑
        if (stateId === 50 && wasAlive && this.isStateAffected(50)) {
            this.setHp(0);                    // 强制HP归零
            this.performCollapse();          // 播放死亡动画
            if ($gameParty.inBattle()) {
                BattleManager.checkBattleEnd(); // 立即检查战斗结束
            }
            this.clearResult();              // 清除动作结果
        }
    };
})();