// data.js

// 1. 定義新花色：開 > 盛 > 轉 > 衰
// 對應大老二花色大小：黑桃(3) > 紅心(2) > 方塊(1) > 梅花(0)
const SUITS = [
    { key: 'spade',   label: '開', name: '開創', color: '#B8860B', rank: 3 }, // 金色 (黑桃)
    { key: 'heart',   label: '盛', name: '盛世', color: '#b22222', rank: 2 }, // 硃砂紅 (紅心)
    { key: 'diamond', label: '轉', name: '轉折', color: '#800080', rank: 1 }, // 紫色 (方塊)
    { key: 'club',    label: '衰', name: '衰敗', color: '#2F4F4F', rank: 0 }  // 墨色 (梅花)
];

// 2. 定義朝代 (大老二邏輯：夏=3 最小，清=2 最大)
const DYNASTIES = [
    { name: '夏',   desc: '華夏開端' },
    { name: '商',   desc: '青銅與甲骨' },
    { name: '周',   desc: '禮樂與封建' },
    { name: '秦',   desc: '大一統帝國' },
    { name: '漢',   desc: '強漢盛世' },
    { name: '三國', desc: '英雄時代' },
    { name: '晉',   desc: '門閥政治' },
    { name: '隋',   desc: '運河與科舉' },
    { name: '唐',   desc: '萬國來朝' },
    { name: '宋',   desc: '文人政治' },
    { name: '元',   desc: '蒙古帝國' },
    { name: '明',   desc: '天子守國門' },
    { name: '清',   desc: '最後的皇朝' }
];

// 3. 52人全明星特殊名單 (All-Star List)
// 格式 Key: "朝代名稱-花色Label" (例如: "明-轉")
const SPECIAL_CARDS = {
    // --- 3. 夏朝 ---
    '夏-開': { name: '禹',     desc: '傳說開端，三過家門而不入' },
    '夏-盛': { name: '啟',     desc: '廢禪讓制，確立家天下' },
    '夏-轉': { name: '少康',   desc: '少康中興，死裡逃生復國' },
    '夏-衰': { name: '夏桀',   desc: '酒池肉林，荒淫無道' },
    
    // --- 4. 商朝 ---
    '商-開': { name: '商湯',   desc: '網開一面，放逐夏桀' },
    '商-盛': { name: '武丁',   desc: '武丁中興，版圖最盛，婦好助陣' },
    '商-轉': { name: '盤庚',   desc: '遷都於殷，挽救九世之亂' },
    '商-衰': { name: '紂王',   desc: '炮烙之刑，酒池肉林' },

    // --- 5. 周朝 ---
    '周-開': { name: '武王',   desc: '牧野之戰，血流漂杵' },
    '周-盛': { name: '周公旦', desc: '制禮作樂，輔佐成王，雖非王但勝王' },
    '周-轉': { name: '平王',   desc: '東遷洛邑，王權衰退，春秋開始' },
    '周-衰': { name: '幽王',   desc: '烽火戲諸侯，博褒姒一笑' },

    // --- 6. 秦朝 ---
    '秦-開': { name: '始皇',   desc: '橫掃六合，千古一帝，統一度量衡' },
    '秦-盛': { name: '昭襄王', desc: '在位56年，戰神白起的主公' },
    '秦-轉': { name: '子嬰',   desc: '去帝號，誅殺趙高，悲劇末代王' },
    '秦-衰': { name: '秦二世', desc: '指鹿為馬，殺兄篡位，二世而亡' },

    // --- 7. 漢朝 ---
    '漢-開': { name: '漢武帝', desc: '犯強漢者，雖遠必誅，罷黜百家' },
    '漢-盛': { name: '漢文帝', desc: '文景之治，黃老無為，休養生息' },
    '漢-轉': { name: '王莽',   desc: '新朝篡漢，疑似穿越者，青銅卡尺' },
    '漢-衰': { name: '漢靈帝', desc: '黨錮之禍，裸遊館，賣官鬻爵' },

    // --- 8. 三國 ---
    '三國-開': { name: '曹操', desc: '魏武帝，治世能臣，亂世梟雄' },
    '三國-盛': { name: '劉備', desc: '昭烈帝，仁義為本，三顧茅廬' },
    '三國-轉': { name: '孫權', desc: '碧眼兒，坐斷東南，生子當如孫仲謀' },
    '三國-衰': { name: '劉禪', desc: '扶不起的阿斗，樂不思蜀' },

    // --- 9. 晉朝 ---
    '晉-開': { name: '司馬炎', desc: '晉武帝，三國歸晉，短暫統一' },
    '晉-盛': { name: '謝安',   desc: '淝水之戰總指揮，東山再起 (代)' },
    '晉-轉': { name: '賈南風', desc: '八王之亂導火線，醜女亂政' },
    '晉-衰': { name: '晉惠帝', desc: '何不食肉糜 (為什麼不吃肉粥？)' },

    // --- 10. 隋朝 ---
    '隋-開': { name: '隋文帝', desc: '結束南北朝分裂，開皇之治' },
    '隋-盛': { name: '獨孤后', desc: '二聖並尊，強勢的一夫一妻制捍衛者' },
    '隋-轉': { name: '楊侑',   desc: '李淵擁立的傀儡恭帝，隋祚告終' },
    '隋-衰': { name: '隋煬帝', desc: '開鑿運河，三徵高句麗，好大喜功' },

    // --- J. 唐朝 (User特規) ---
    '唐-開': { name: '唐太宗', desc: '貞觀之治，天可汗，納諫如流' },
    '唐-盛': { name: '武則天', desc: '日月當空，唯一女皇，無字碑' },
    '唐-轉': { name: '楊貴妃', desc: '一騎紅塵妃子笑，安史之亂導火線' }, // User指定
    '唐-衰': { name: '唐哀帝', desc: '被朱溫篡位，大唐三百年基業終結' },

    // --- Q. 宋朝 ---
    '宋-開': { name: '宋太祖', desc: '趙匡胤，陳橋兵變，杯酒釋兵權' },
    '宋-盛': { name: '宋仁宗', desc: '名臣輩出，包青天的主公，最仁之君' },
    '宋-轉': { name: '岳飛',   desc: '十二道金牌，莫須有之罪，悲劇英雄' },
    '宋-衰': { name: '宋徽宗', desc: '諸事皆能，獨不能為君，靖康之恥' },

    // --- K. 元朝 ---
    '元-開': { name: '忽必烈', desc: '建立大元，定都大都 (北京)' },
    '元-盛': { name: '成吉思汗', desc: '一代天驕，射大雕，帝國奠基者' },
    '元-轉': { name: '奇皇后', desc: '高麗貢女變皇后，權傾朝野' },
    '元-衰': { name: '元順帝', desc: '逃回漠北，元朝在中原統治結束' },

    // --- A. 明朝 (User特規) ---
    '明-開': { name: '朱元璋', desc: '開局一個碗，驅逐胡虜，洪武之治' }, // User指定: 開國
    '明-盛': { name: '萬曆',   desc: '張居正改革，萬曆中興，最富庶時期' }, // User指定: 盛世
    '明-轉': { name: '朱棣',   desc: '靖難之役，唯一的藩王造反成功' },    // User指定: 轉折
    '明-衰': { name: '崇禎',   desc: '天子守國門，君王死社稷，煤山自縊' }, // User指定: 衰敗

    // --- 2. 清朝 ---
    '清-開': { name: '康熙',   desc: '擒鰲拜、平三藩、收台灣，在位最久' },
    '清-盛': { name: '乾隆',   desc: '十全老人，盛極而衰，六下江南' },
    '清-轉': { name: '慈禧',   desc: '垂簾聽政47年，量中華之物力結國之歡心' },
    '清-衰': { name: '溥儀',   desc: '半生傀儡，大清亡，最後的皇帝' }
};

function createDeck() {
    let deck = [];
    let idCounter = 0;

    DYNASTIES.forEach((dyn, index) => {
        let logicValue = index; // 0=夏 ... 12=清

        SUITS.forEach((suit) => {
            let key = `${dyn.name}-${suit.label}`; // 組合 Key, e.g. "明-轉"
            let special = SPECIAL_CARDS[key];

            // 防呆：如果萬一沒對應到，給個預設值
            let finalName = special ? special.name : dyn.name;
            let finalDesc = special ? special.desc : dyn.desc;

            deck.push({
                id: idCounter++,
                dynasty: dyn.name,       // 朝代
                value: logicValue,       // 數值
                suitRank: suit.rank,     // 花色大小 (3~0)
                suitLabel: suit.label,   // 花色字 (開/盛/轉/衰)
                suitColor: suit.color,   // 顏色
                suitName: suit.name,     // 全名
                
                monarch: finalName,      // 君主/人物
                desc: finalDesc,         // 描述
                
                selected: false          // 預設未選取
            });
        });
    });
    return deck;
}
