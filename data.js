// data.js

// 1. 定義新花色：開 > 盛 > 轉 > 衰
// 對應大老二花色大小：黑桃(3) > 紅心(2) > 方塊(1) > 梅花(0)
const SUITS = [
    { key: 'spade',   label: '開', name: '開創', color: '#B8860B', rank: 3 }, // 金色
    { key: 'heart',   label: '盛', name: '盛世', color: '#b22222', rank: 2 }, // 硃砂紅
    { key: 'diamond', label: '轉', name: '轉折', color: '#800080', rank: 1 }, // 紫色
    { key: 'club',    label: '衰', name: '衰敗', color: '#2F4F4F', rank: 0 }  // 墨色
];

// 2. 定義朝代 (不使用撲克牌數字，改用 index 權重)
const DYNASTIES = [
    { name: '夏',   king: '禹',     desc: '傳說開端，治水英雄' },
    { name: '商',   king: '湯',     desc: '網開一面，仁慈之君' },
    { name: '周',   king: '武王',   desc: '封建親戚，以藩屏周' },
    { name: '秦',   king: '始皇',   desc: '橫掃六合，統一文字' },
    { name: '漢',   king: '武帝',   desc: '犯強漢者，雖遠必誅' },
    { name: '三國', king: '曹操',   desc: '寧教我負天下人' },
    { name: '晉',   king: '武帝',   desc: '三國歸晉，短暫統一' },
    { name: '隋',   king: '文帝',   desc: '開皇之治，科舉濫觴' },
    { name: '唐',   king: '太宗',   desc: '貞觀之治，天可汗' },
    { name: '宋',   king: '太祖',   desc: '杯酒釋兵權' },
    { name: '元',   king: '忽必烈', desc: '鐵騎踏遍歐亞' },
    { name: '明',   king: '朱元璋', desc: '驅逐胡虜，恢復中華' }, // 修正為朱元璋
    { name: '清',   king: '康熙',   desc: '千古一帝，在位最久' }
];

// 3. 全明星特殊名單 (根據你的要求更新)
const SPECIAL_CARDS = {
    // 夏
    '夏-衰': { name: '夏桀', desc: '酒池肉林，荒淫無道' },
    
    // 商
    '商-盛': { name: '武丁', desc: '武丁中興，版圖最大' },
    '商-衰': { name: '紂王', desc: '炮烙之刑，酒池肉林' },

    // 周
    '周-盛': { name: '周公旦', desc: '制禮作樂，輔佐成王' },
    '周-衰': { name: '周幽王', desc: '烽火戲諸侯' },

    // 秦
    '秦-盛': { name: '秦昭襄王', desc: '遠交近攻，戰神白起主公' },
    '秦-轉': { name: '子嬰', desc: '去帝號，末代秦王' },
    '秦-衰': { name: '秦二世', desc: '指鹿為馬，二世而亡' },

    // 漢
    '漢-盛': { name: '漢文帝', desc: '文景之治，黃老無為' },
    '漢-轉': { name: '王莽', desc: '新朝篡漢，疑似穿越者' },
    '漢-衰': { name: '漢靈帝', desc: '黨錮之禍，裸遊館' },

    // 三國
    '三國-盛': { name: '劉備', desc: '昭烈帝，仁義為本' },
    '三國-轉': { name: '孫權', desc: '碧眼兒，坐斷東南' },
    '三國-衰': { name: '劉禪', desc: '樂不思蜀，扶不起的阿斗' },

    // 晉
    '晉-盛': { name: '謝安', desc: '淝水之戰，東山再起 (代)' }, // 晉朝盛世較難選，用名臣謝安代替
    '晉-轉': { name: '賈南風', desc: '八王之亂，醜女亂政' },
    '晉-衰': { name: '晉惠帝', desc: '何不食肉糜' },

    // 隋
    '隋-盛': { name: '獨孤皇后', desc: '二聖並尊，開皇之治' },
    '隋-轉': { name: '楊侑', desc: '傀儡恭帝，隋祚告終' },
    '隋-衰': { name: '隋煬帝', desc: '好大喜功，三徵高句麗' },

    // 唐 (你的要求：轉折改為楊貴妃)
    '唐-盛': { name: '武則天', desc: '日月當空，無字碑' },
    '唐-轉': { name: '楊貴妃', desc: '一騎紅塵妃子笑，安史亂源' }, 
    '唐-衰': { name: '唐哀帝', desc: '朱溫篡位，大唐終結' },

    // 宋
    '宋-盛': { name: '宋仁宗', desc: '唐宋八大家佔六，最仁之君' },
    '宋-轉': { name: '岳飛', desc: '十二道金牌，莫須有' }, // 轉折選岳飛(悲劇英雄)比高宗更有記憶點
    '宋-衰': { name: '宋徽宗', desc: '瘦金體，靖康之恥' },

    // 元
    '元-盛': { name: '成吉思汗', desc: '一代天驕，射大雕' },
    '元-轉': { name: '奇皇后', desc: '高麗貢女，權傾朝野' },
    '元-衰': { name: '元順帝', desc: '逃回漠北，元朝滅亡' },

    // 明 (你的要求：大幅修改)
    '明-盛': { name: '萬曆', desc: '張居正改革，萬曆中興' },
    '明-轉': { name: '朱棣', desc: '靖難之役，篡位奪權' }, // 轉折放朱棣
    '明-衰': { name: '崇禎', desc: '煤山自縊，君王死社稷' },

    // 清
    '清-盛': { name: '乾隆', desc: '十全老人，盛極而衰' },
    '清-轉': { name: '慈禧', desc: '垂簾聽政，量中華之物力' },
    '清-衰': { name: '溥儀', desc: '半生傀儡，末代皇帝' }
};

function createDeck() {
    let deck = [];
    let idCounter = 0;

    DYNASTIES.forEach((dyn, index) => {
        // 大老二邏輯值：夏(0) ~ 清(12)
        // 雖然不顯示數字，但後端比大小還是需要這個 value
        let logicValue = index; 

        SUITS.forEach((suit) => {
            let key = `${dyn.name}-${suit.label}`; // e.g. "明-轉" (注意這裡用 label 匹配比較直觀)
            // 由於 SPECIAL_CARDS 的 key 邏輯微調，我們用這行代碼來匹配上面的 key
            // 為了方便，我們還是用 "朝代-花色key" (明-diamond) 來匹配上面的物件會比較穩
            // 但為了配合上方 SPECIAL_CARDS 的中文 key 寫法，這裡做個轉換：
            let lookupKey = `${dyn.name}-${suit.label}`; // 嘗試用 "明-轉" 找
            // 找不到的話，試試看能不能用預設花色對應，這裡簡化處理：
            // 其實上面的 SPECIAL_CARDS 我已經改成用中文key了 (e.g., '明-轉')，所以直接對應即可。
            
            // 為了防呆，如果上面的 key 寫錯 (比如寫成 '明-diamond')，這裡要做對應
            // 為了程式碼乾淨，建議上面的 SPECIAL_CARDS 全部改成 '明-轉' 這種中文 Key
            
            let special = SPECIAL_CARDS[lookupKey];

            deck.push({
                id: idCounter++,
                dynasty: dyn.name,       // 朝代 (夏)
                value: logicValue,       // 數值 (0~12)
                suitRank: suit.rank,     // 花色大小 (3~0)
                suitLabel: suit.label,   // 花色字 (開/盛/轉/衰)
                suitColor: suit.color,   // 顏色
                suitName: suit.name,     // 全名 (開創/盛世...)
                
                monarch: special ? special.name : dyn.king,
                desc: special ? special.desc : dyn.desc,
                
                selected: false // 預設未選取
            });
        });
    });
    return deck;
}
