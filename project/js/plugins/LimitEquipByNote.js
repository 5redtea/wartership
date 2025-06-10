/*:
 * @target MV MZ
 * @plugindesc Restrict equipment to specific actors using note tags
 * @author YourName
 * 
 * @help 
 * Add <onlyFor:X> in armor notes to restrict equipment to actor with ID X
 * 
 * Example: <onlyFor:1> means only actor with ID 1 can equip this
 * 
 * Features:
 * - Hides restricted items from equip menu
 * - Blocks equipping through all means
 * - Prevents "Optimize Equipment" from using restricted items
 * - Filters restricted items in shops
 */

(function() {
    // Store original functions
    var _Window_EquipItem_includes = Window_EquipItem.prototype.includes;
    var _Scene_Equip_onItemOk = Scene_Equip.prototype.onItemOk;
    var _Window_ShopBuy_isEnabled = Window_ShopBuy.prototype.isEnabled;
    var _Game_Actor_optimizeEquipments = Game_Actor.prototype.optimizeEquipments;

    // Check if actor can equip an item
    function canActorEquip(actor, item) {
        if (item && DataManager.isArmor(item) && item.meta && item.meta.onlyFor) {
            return parseInt(item.meta.onlyFor) === actor.actorId();
        }
        return true;
    }

    // Modified equip item window filtering
    Window_EquipItem.prototype.includes = function(item) {
        if (!_Window_EquipItem_includes.call(this, item)) return false;
        return canActorEquip(this._actor, item);
    };

    // Equip validation
    Scene_Equip.prototype.onItemOk = function() {
        var item = this._itemWindow.item();
        if (!canActorEquip(this._actor, item)) {
            SoundManager.playBuzzer();
            this._itemWindow.activate();
            return;
        }
        _Scene_Equip_onItemOk.call(this);
    };

    // Shop filtering
    Window_ShopBuy.prototype.isEnabled = function(item) {
        if (!_Window_ShopBuy_isEnabled.call(this, item)) return false;
        var actor = $gameParty.menuActor() || $gameParty.leader();
        return canActorEquip(actor, item);
    };

    // Optimize Equipment protection
    Game_Actor.prototype.optimizeEquipments = function() {
        var bestEquipments = [];
        var equips = this.equipSlots();
        
        // Get all equippable items that aren't restricted
        var items = $gameParty.equipItems().filter(function(item) {
            return this.canEquip(item) && canActorEquip(this, item);
        }, this);
        
        // Find best equipment for each slot
        for (var i = 0; i < equips.length; i++) {
            var slotId = equips[i];
            var bestItem = null;
            var bestPerformance = -1000;
            
            for (var j = 0; j < items.length; j++) {
                var item = items[j];
                if (this.canEquip(item) && item.etypeId === slotId) {
                    var performance = this.calcEquipItemPerformance(item);
                    if (performance > bestPerformance) {
                        bestPerformance = performance;
                        bestItem = item;
                    }
                }
            }
            bestEquipments.push(bestItem);
        }
        
        // Equip the best valid items
        for (var k = 0; k < bestEquipments.length; k++) {
            if (bestEquipments[k]) {
                this.changeEquip(k, bestEquipments[k]);
            }
        }
    };
})();