/*:
 * @target MZ
 * @plugindesc 彻底禁用敌群20 - 终极修复版
 * @author YourName
 * @help
 * 功能：
 * 1. 击败敌群20后显示对话
 * 2. 调用公共事件7
 * 3. 设置开关28
 * 4. 100%确保敌群20不会再出现
 */

(() => {
    // 初始化游戏系统变量
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._defeatedTroops = [];
    };

    // 存储原始函数
    const _BattleManager_processVictory = BattleManager.processVictory;
    const _Game_Troop_setup = Game_Troop.prototype.setup;
    
    // 覆盖战斗胜利处理
    BattleManager.processVictory = function() {
        _BattleManager_processVictory.call(this);
        
        if ($gameTroop && $gameTroop._troopId === 20) {
            // 1. 显示胜利对话
            //$gameMessage.setBackground(0);
            //$gameMessage.setPositionType(1);
            $gameMessage.add("四周微妙的气氛消失了。");
            
            // 2. 调用公共事件7
            $gameTemp.reserveCommonEvent(7);
            
            // 3. 设置开关28
            $gameSwitches.setValue(28, true);
            
            // 4. 永久标记敌群20为已击败
            if ($gameSystem) {
                $gameSystem._defeatedTroops = $gameSystem._defeatedTroops || [];
                if (!$gameSystem._defeatedTroops.includes(20)) {
                    $gameSystem._defeatedTroops.push(20);
                }
            }
        }
    };
    
    // 覆盖敌群设置，阻止已击败的敌群
    Game_Troop.prototype.setup = function(troopId) {
        if ($gameSystem && $gameSystem._defeatedTroops && $gameSystem._defeatedTroops.includes(troopId)) {
            // 替换为敌群21
            troopId = 21;
        }
        _Game_Troop_setup.call(this, troopId);
    };
    
    // 确保存档兼容性
    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        if ($gameSystem) {
            $gameSystem._defeatedTroops = $gameSystem._defeatedTroops || [];
        }
    };
})();