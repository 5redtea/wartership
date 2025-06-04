// 保存原始方法
const _Sprite_Damage_initialize = Sprite_Damage.prototype.initialize;
const _Sprite_Damage_setup = Sprite_Damage.prototype.setup;

// 初始化时添加dy属性
Sprite_Damage.prototype.initialize = function() {
    _Sprite_Damage_initialize.call(this);
    this.dy = 0; // 确保dy属性存在
};

// 修改setup方法
Sprite_Damage.prototype.setup = function(target) {
    _Sprite_Damage_setup.call(this, target);
    
    if (target && target.enemy) {
        const enemy = target.enemy();
        if (enemy) {
            const note = enemy.note;
            // 支持更多匹配格式
            const popyMatch = note.match(/<popy:\s*([-]?\d+)>/i) 
                          || note.match(/popy:\s*([-]?\d+)/i);
            if (popyMatch) {
                this.dy = parseInt(popyMatch[1]);
                console.log(`Applied popy: ${this.dy} to ${enemy.name}`); // 调试
                this.y += this.dy; // 直接修改Y位置
            }
        }
    }
};