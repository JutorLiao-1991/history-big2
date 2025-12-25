// data.js

// 1. 定義花色 (由大到小：黑桃 > 紅心 > 方塊 > 梅花)
const SUITS = [
    { key: 'spade', symbol: '♠', name: '霸業', class: 'suit-spade', color: '#B8860B' }, // 暗金色
    { key: 'heart', symbol: '♥', name: '治世', class: 'suit-heart', color: '#8B0000' }, // 深紅色
    { key: 'diamond', symbol: '♦', name: '爭議', class: 'suit-diamond', color: '#800080' }, // 紫色
    { key: 'club', symbol: '♣', name: '衰敗', class: 'suit-club', color: '#2F4F4F' }    // 墨綠色
];

// 2. 定義朝代 (大老二規則：3最小，2最大)
// 我們依序排列，之後用程式碼給予權重 (Weight)
const DYNASTIES = [
    { label: '3', dynasty: '夏', king: '禹', desc: '傳說開端，治水英雄' },
    { label: '4', dynasty: '商', king: '湯', desc: '網開一面，仁慈之君' },
    { label: '5', dynasty: '周', king: '武王', desc: '封建親戚，以藩屏周' },
    { label: '6', dynasty: '秦', king: '始皇', desc: '橫掃六合，統一文字' },
    { label: '7', dynasty: '漢', king: '武帝', desc: '犯強漢者，雖遠必誅' },
    { label: '8', dynasty: '三國', king: '曹操', desc: '寧教我負天下人' },
    { label: '9', dynasty: '晉', king: '武帝', desc: '三國歸晉，短暫統一' },
    { label: '10', dynasty: '隋', king: '文帝', desc: '開皇之治，科舉濫觴' },
    { label: 'J', dynasty: '唐', king: '太宗', desc: '貞觀之治，天可汗' },
    { label: 'Q', dynasty: '宋', king: '太祖', desc: '杯酒釋兵權' },
    { label: 'K', dynasty: '元', king: '世祖', desc: '鐵騎踏遍歐亞' },
    { label: 'A', dynasty: '明', king: '成祖', desc: '永樂大典，鄭和下西洋' },
    { label: '2', dynasty: '清', king: '康熙', desc: '千古一帝，在位最久' }
];

// 3. 特殊君主覆寫表 (Override)
// 預設所有花色都是該朝代的「代表君主」，但如果有特殊歷史人物(如暴君、穿越者)，在此設定
const SPECIAL_CARDS = {
    '6-club': { name: '秦二世', desc: '指鹿為馬，二世而亡' }, // 秦-梅花(衰敗)
    '6-diamond': { name: '子嬰', desc: '去帝號，末代秦王' },    // 秦-方塊(爭議)
    '7-diamond': { name: '王莽', desc: '疑似穿越者，游標卡尺' }, // 漢-方塊
    '10-club': { name: '隋煬帝', desc: '開鑿運河，好大喜功' },   // 隋-梅花
    'J-heart': { name: '武則天', desc: '一代女皇，無字碑' },      // 唐-紅心
    '3-club': { name: '夏桀', desc: '酒池肉林，荒淫無道' }       // 夏-梅花
};

// 4. 產生 52 張牌的工廠函式
function createDeck() {
    let deck = [];
    let idCounter = 0;

    DYNASTIES.forEach((dynasty, index) => {
        // 大老二邏輯值：3的權重是0，2的權重是12 (方便比較大小)
        let logicValue = index; 

        SUITS.forEach((suit, suitIndex) => {
            // 檢查有沒有特殊設定，沒有就用預設君主
            let key = `${dynasty.label}-${suit.key}`;
            let special = SPECIAL_CARDS[key];

            let card = {
                id: idCounter++,
                label: dynasty.label,      // 顯示的數字 (3, 4, ..., K, A, 2)
                value: logicValue,         // 邏輯大小 (0 ~ 12)
                suit: suit.key,            // 花色代號
                suitRank: 3 - suitIndex,   // 花色大小 (3:黑桃 ~ 0:梅花)
                suitSymbol: suit.symbol,   // 花色符號
                suitName: suit.name,       // 花色中文 (霸業/治世...)
                suitColor: suit.color,     // 顏色
                dynasty: dynasty.dynasty,  // 朝代
                
                // 決定君主名稱和描述
                monarch: special ? special.name : dynasty.king, 
                desc: special ? special.desc : dynasty.desc,
                
                // 圖片路徑 (之後我們要把圖片丟進 images 資料夾)
                // 格式: images/秦-霸業.jpg
                imgSrc: `images/${dynasty.dynasty}-${suit.name}.jpg` 
            };
            deck.push(card);
        });
    });
    return deck;
}