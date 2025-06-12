Game_Battler.prototype.expRate = function() {
    let rate = 1.0;
    // 检查状态加成
    this.states().forEach(state => {
        if (state.meta.expRate) rate *= Number(state.meta.expRate);
    });
    // 检查装备加成
    if (this.equips) {
        this.equips().forEach(item => {
            if (item && item.meta.expRate) rate *= Number(item.meta.expRate);
        });
    }
    return rate;
};

Game_Enemy.prototype.exp = function() {
    return Math.floor(this.enemy().exp * this.expRate());
};