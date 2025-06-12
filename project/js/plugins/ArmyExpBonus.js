// 队伍经验加成插件 - 使用<armyexpRate>标签
(() => {
    // 队伍经验加成率
    let _partyExpRate = 1.0;
    
    // 原方法覆盖
    const _Game_Actor_exp = Game_Actor.prototype.exp;
    Game_Actor.prototype.exp = function() {
        const baseExp = _Game_Actor_exp.apply(this, arguments);
        return Math.floor(baseExp * _partyExpRate);
    };
    
    // 设置队伍经验加成
    Game_Party.prototype.setExpRate = function(rate) {
        _partyExpRate = rate;
    };
    
    // 添加队伍经验加成技能
    Game_Actor.prototype.learnPartyExpSkill = function(skillId) {
        if (!this._partyExpSkills) this._partyExpSkills = [];
        if (!this._partyExpSkills.includes(skillId)) {
            this._partyExpSkills.push(skillId);
            this.refreshPartyExpRate();
        }
    };
    
    // 移除队伍经验加成技能
    Game_Actor.prototype.forgetPartyExpSkill = function(skillId) {
        if (this._partyExpSkills) {
            const index = this._partyExpSkills.indexOf(skillId);
            if (index >= 0) {
                this._partyExpSkills.splice(index, 1);
                this.refreshPartyExpRate();
            }
        }
    };
    
    // 刷新队伍经验率
    Game_Actor.prototype.refreshPartyExpRate = function() {
        let rate = 1.0;
        $gameParty.members().forEach(actor => {
            if (actor._partyExpSkills) {
                actor._partyExpSkills.forEach(skillId => {
                    const skill = $dataSkills[skillId];
                    if (skill.meta.armyexpRate) {
                        rate *= Number(skill.meta.armyexpRate);
                    }
                });
            }
        });
        $gameParty.setExpRate(rate);
    };
    
    // 重写学习技能方法以自动检测
    const _Game_Actor_learnSkill = Game_Actor.prototype.learnSkill;
    Game_Actor.prototype.learnSkill = function(skillId) {
        _Game_Actor_learnSkill.call(this, skillId);
        const skill = $dataSkills[skillId];
        if (skill && skill.meta.armyexpRate) {
            this.learnPartyExpSkill(skillId);
        }
    };
    
    // 重写遗忘技能方法以自动处理
    const _Game_Actor_forgetSkill = Game_Actor.prototype.forgetSkill;
    Game_Actor.prototype.forgetSkill = function(skillId) {
        _Game_Actor_forgetSkill.call(this, skillId);
        this.forgetPartyExpSkill(skillId);
    };
})();