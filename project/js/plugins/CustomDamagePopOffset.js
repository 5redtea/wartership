// 保存原始方法
const _Sprite_Damage_setup = Sprite_Damage.prototype.setup;

// 用于记录已处理的目标
const _ProcessedTargets = new Set();

Sprite_Damage.prototype.setup = function(target) {
    _Sprite_Damage_setup.call(this, target);
    
    if (target && target.enemy) {
        const enemy = target.enemy();
        const targetKey = `enemy_${enemy.id}`;
        
        // 检查是否已经处理过这个目标的偏移
        if (!_ProcessedTargets.has(targetKey)) {
            const note = enemy.note;
            const popyMatch = note.match(/<popy:\s*([-]?\d+)>/i) || 
                             note.match(/popy:\s*([-]?\d+)/i);
            
            if (popyMatch) {
                const popy = parseInt(popyMatch[1]);
                // 直接修改飘字位置
                this.y += popy;
                console.log(`应用飘字偏移: ${popy} 对敌人 ${enemy.name}`);
                
                // 标记这个目标已处理
                _ProcessedTargets.add(targetKey);
            }
        }
    }
};

// 战斗回合结束时清除记录
const _BattleManager_endAction = BattleManager.endAction;
BattleManager.endAction = function() {
    _ProcessedTargets.clear();
    _BattleManager_endAction.call(this);
};

// 战斗结束后清除记录
const _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
Scene_Battle.prototype.terminate = function() {
    _ProcessedTargets.clear();
    _Scene_Battle_terminate.call(this);
};