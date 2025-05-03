/*:
 * @target MZ
 * @plugindesc 战斗后保留CP
 * @author YourName
 */


void (function() {
    // 覆盖战斗结束时的TP/CP重置逻辑
    const _Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
    Game_Battler.prototype.onBattleEnd = function() {
        _Game_Battler_onBattleEnd.call(this);
        this._cp = this._cp || 0; // 如果CP未定义，设为0（防止报错）
        // this._tp = this._tp; // 如果要保留TP，取消注释
    };
})();