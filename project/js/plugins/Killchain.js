/*:
 * @target MZ
 * @plugindesc 多个技能击杀目标后再次释放(带文本提示)
 * @author YourName
 *
 * @param Skill IDs
 * @desc 触发连锁的技能ID(用逗号分隔)
 * @default 124,125,126
 *
 * @param Max Chain
 * @desc 最大连锁次数
 * @default 3
 *
 * @param Message Text
 * @desc 连续释放时显示的文字
 * @default 怒气上涌，再次行动了！
 */
 
(function() {
    var parameters = PluginManager.parameters('SkillChainOnKill');
    var skillIds = String(parameters['Skill IDs'] || "124,125,126").split(',').map(Number);
    var maxChain = Number(parameters['Max Chain'] || 3);
    var messageText = String(parameters['Message Text'] || "怒气上涌，再次行动了！");
    
    // 重写应用伤害方法
    var _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        var result = _Game_Action_apply.call(this, target);
        
        // 检查是否击杀且技能在列表中
        if (target.isDead() && this.isSkill() && skillIds.includes(this.item().id)) {
            if (!this.subject()._skillChainCount) {
                this.subject()._skillChainCount = 0;
            }
            
            if (this.subject()._skillChainCount < maxChain) {
                this.subject()._skillChainCount++;
                
                // 获取有效目标
                var aliveMembers = this.isForOpponent() ? 
                    $gameParty.aliveMembers() : $gameTroop.aliveMembers();
                
                if (aliveMembers.length > 0) {
                    var targetIndex = Math.randomInt(aliveMembers.length);
                    
                    // 显示文本提示
                    var subjectName = this.subject().name();
                    $gameMessage.add(subjectName + messageText);
                    
                    // 延迟执行防止递归问题
                    setTimeout(function() {
                        this.subject().forceAction(this.item().id, targetIndex);
                        BattleManager.forceAction(this.subject());
                    }.bind(this), 1);
                }
            }
        }
        return result;
    };
    
    // 重置计数器
    var _BattleManager_startBattle = BattleManager.startBattle;
    BattleManager.startBattle = function() {
        _BattleManager_startBattle.call(this);
        $gameParty.members().concat($gameTroop.members()).forEach(function(member) {
            if (member) member._skillChainCount = 0;
        });
    };
    
    // 战斗结束也重置
    var _BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function(result) {
        _BattleManager_endBattle.call(this, result);
        $gameParty.members().concat($gameTroop.members()).forEach(function(member) {
            if (member) member._skillChainCount = 0;
        });
    };
})();