const _Game_Battler_useItem = Game_Battler.prototype.useItem;
Game_Battler.prototype.useItem = function(item) {
    _Game_Battler_useItem.call(this, item);
    if (DataManager.isItem(item) && this.isActor()) {
        const boss = $gameTroop.members().find(e => e.isStateAffected(44));
        if (boss) { // Y是"道具反击"状态的ID
            $gameTemp._bossCounterRequest = {boss: boss, skillId: 104};
        }
    }
};

const _BattleManager_updateAction = BattleManager.updateAction;
BattleManager.updateAction = function() {
    if ($gameTemp._bossCounterRequest) {
        const {boss, skillId} = $gameTemp._bossCounterRequest;
        boss.forceAction(skillId, -1);
        this.forceAction(boss);
        $gameTemp._bossCounterRequest = null;
        return;
    }
    _BattleManager_updateAction.call(this);
};