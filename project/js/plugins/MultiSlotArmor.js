/*:
 * @target MZ
 * @plugindesc 允许类型4装备装备到第4、5、6格
 * @author 你的名字
 * @help 
 * 这个插件允许etypeId为4的装备可以装备到第4、5、6装备格上。
 * 不需要任何配置，直接启用即可。
 * 
 * 版本 1.0
 */

(() => {
    'use strict';
    
    // 存储原始方法
    const _Game_Actor_equipSlots = Game_Actor.prototype.equipSlots;
    const _Game_Actor_isEquipTypeOk = Game_Actor.prototype.isEquipTypeOk;
    
    // 修改装备槽方法
    Game_Actor.prototype.equipSlots = function() {
        const slots = _Game_Actor_equipSlots.call(this);
        
        // 如果槽位足够（至少有6个槽）
        if (slots.length >= 6) {
            // 将第4、5、6槽(索引3、4、5)设为类型4
            slots[3] = 4;
            slots[4] = 4;
            slots[5] = 4;
        }
        
        return slots;
    };
    
    // 修改装备类型检查方法
    Game_Actor.prototype.isEquipTypeOk = function(slotId) {
        const slots = this.equipSlots();
        const slotType = slots[slotId];
        const item = this.equips()[slotId];
        
        // 如果是第4、5、6槽(索引3、4、5)
        if ([3, 4, 5].includes(slotId)) {
            // 允许装备类型4或者为空
            return !item || item.etypeId === 4;
        }
        
        // 其他槽位使用默认检查
        return _Game_Actor_isEquipTypeOk.call(this, slotId);
    };
    
    // 游戏加载后刷新所有角色的装备
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        this.refreshActorsEquipment();
    };
    
    Scene_Map.prototype.refreshActorsEquipment = function() {
        $gameParty.members().forEach(actor => {
            actor.releaseUnequippableItems();
        });
    };
})();