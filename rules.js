// rules.js - 遊戲規則裁判 (Game Logic)

// 牌型定義
const HAND_TYPES = {
    INVALID: '無效',
    SINGLE: '單張',
    PAIR: '對子',
    STRAIGHT: '順子',      // 5張
    FULL_HOUSE: '葫蘆',    // 3+2
    FOUR_OF_A_KIND: '鐵支', // 4+1
    STRAIGHT_FLUSH: '同花順' // 5張
};

/**
 * 核心函式：檢查出牌是否合法
 * @param {Array} cards - 想要出的牌 (Array of Objects)
 * @param {Object} lastHand - 上家出的牌型 (可為 null)
 * @returns {Object} { valid: boolean, msg: string, type: string, value: number }
 */
function validatePlay(cards, lastHand) {
    // 1. 先把牌從小到大排序 (依據 value 0~12, 花色 0~3)
    cards.sort((a, b) => {
        if (a.value === b.value) return a.suitRank - b.suitRank;
        return a.value - b.value;
    });

    // 2. 判斷牌型
    const typeInfo = getHandType(cards);
    
    if (typeInfo.type === HAND_TYPES.INVALID) {
        return { valid: false, msg: "這不是合法的牌型！" };
    }

    // 3. 如果是第一手 (或是上家大家都PASS)，只要牌型合法就能出
    if (!lastHand || !lastHand.type) {
        return { valid: true, ...typeInfo };
    }

    // 4. 如果要壓上家的牌
    return compareHands(typeInfo, lastHand);
}

// --- 內部邏輯區 ---

function getHandType(cards) {
    const len = cards.length;
    const maxCard = cards[len - 1]; // 最大的牌 (用於比較)

    // A. 單張
    if (len === 1) {
        return { type: HAND_TYPES.SINGLE, value: maxCard.value, suit: maxCard.suitRank, maxCard };
    }

    // B. 對子 (2張數值相同)
    if (len === 2) {
        if (cards[0].value === cards[1].value) {
            return { type: HAND_TYPES.PAIR, value: maxCard.value, suit: maxCard.suitRank, maxCard };
        }
    }

    // C. 五張牌的邏輯
    if (len === 5) {
        return get5CardType(cards, maxCard);
    }

    // 目前僅支援 1, 2, 5 張牌
    return { type: HAND_TYPES.INVALID };
}

function get5CardType(cards, maxCard) {
    // 統計數字出現頻率
    const counts = {};
    cards.forEach(c => { counts[c.value] = (counts[c.value] || 0) + 1; });
    const values = Object.values(counts);

    // 1. 鐵支 (4+1)
    if (values.includes(4)) {
        // 找出鐵支是哪個數字
        const fourVal = parseInt(Object.keys(counts).find(k => counts[k] === 4));
        return { type: HAND_TYPES.FOUR_OF_A_KIND, value: fourVal, suit: 4, maxCard }; // suit 4 確保壓過任何非鐵支
    }

    // 2. 葫蘆 (3+2)
    if (values.includes(3) && values.includes(2)) {
        // 比大小是比那個 "3張" 的數字
        const threeVal = parseInt(Object.keys(counts).find(k => counts[k] === 3));
        return { type: HAND_TYPES.FULL_HOUSE, value: threeVal, suit: 0, maxCard };
    }

    // 3. 順子 (數值連續)
    // 判斷是否連續 (因為我們已經排序過了)
    let isStraight = true;
    for (let i = 0; i < 4; i++) {
        if (cards[i+1].value - cards[i].value !== 1) {
            isStraight = false;
            break;
        }
    }
    // 特殊順子 (大老二規則)：A-2-3-4-5 (在我們的系統是 明(11)-清(12)-夏(0)-商(1)-周(2)) 
    // 這邊暫時先做「普通順子」，不處理 A2345 這種斷層，避免邏輯太複雜

    // 4. 同花 (花色相同)
    const isFlush = cards.every(c => c.suitRank === cards[0].suitRank);

    if (isStraight && isFlush) {
        return { type: HAND_TYPES.STRAIGHT_FLUSH, value: maxCard.value, suit: maxCard.suitRank, maxCard };
    }
    
    if (isStraight) {
        return { type: HAND_TYPES.STRAIGHT, value: maxCard.value, suit: maxCard.suitRank, maxCard };
    }

    return { type: HAND_TYPES.INVALID };
}

function compareHands(current, last) {
    // 規則 1: 牌型張數必須一樣 (除了鐵支/同花順可以壓怪物)
    // 簡單版：先要求張數與類型一致
    
    // 特殊：鐵支 > 葫蘆 > 順子 (如果都玩5張)
    const rank5 = { [HAND_TYPES.STRAIGHT]: 1, [HAND_TYPES.FULL_HOUSE]: 2, [HAND_TYPES.FOUR_OF_A_KIND]: 3, [HAND_TYPES.STRAIGHT_FLUSH]: 4 };
    
    if (current.type !== last.type) {
        // 如果都是5張牌，比較牌型大小
        if (rank5[current.type] && rank5[last.type]) {
            if (rank5[current.type] > rank5[last.type]) {
                return { valid: true, ...current };
            }
        }
        return { valid: false, msg: "牌型不符！" };
    }

    // 規則 2: 類型相同，比大小
    // 先比數字
    if (current.value > last.value) return { valid: true, ...current };
    // 數字一樣，比花色
    if (current.value === last.value && current.suit > last.suit) return { valid: true, ...current };

    return { valid: false, msg: "你的牌不夠大！" };
}
