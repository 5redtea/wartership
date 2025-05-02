// 保存原始方法
const _Game_Enemy_selectTarget = Game_Enemy.prototype.selectTarget;

// 重写目标选择逻辑
Game_Enemy.prototype.selectTarget = function(skillId) {
  // 如果是特定技能（技能ID=95）
  if (skillId === 95) { 
    const target7 = $gameParty.members().find(a => a.actorId() === 0007 && a.isAlive());
    return target7 || _Game_Enemy_selectTarget.call(this, skillId); // 不存在则走默认逻辑
  }
  return _Game_Enemy_selectTarget.call(this, skillId); // 其他技能正常处理
};