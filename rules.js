// rules.js
const HAND_TYPES = {
    INVALID: '無效',
    SINGLE: '單張',
    PAIR: '對子',
    STRAIGHT: '順子',
    FULL_HOUSE: '葫蘆',
    FOUR_OF_A_KIND: '鐵支',
    STRAIGHT_FLUSH: '同花順'
};

function validatePlay(cards, lastHand) {
    // 1. 排序
    cards.sort((a, b) => {
        if (a.value === b.value) return a.suitRank - b.suitRank;
        return a.value - b.value;
    });

    // 2. 判斷牌型
    const typeInfo = getHandType(cards);
    
    if (typeInfo.type === HAND_TYPES.INVALID) {
        return { valid: false, msg: "這不是合法的牌型！" };
    }

    // 3. 第一手或任意出
    if (!lastHand || !lastHand.type) {
        return { valid: true, ...typeInfo };
    }

    // 4. 比大小
    return compareHands(typeInfo, lastHand);
}

function getHandType(cards) {
    const len = cards.length;
    const maxCard = cards[len - 1];

    if (len === 1) return { type: HAND_TYPES.SINGLE, value: maxCard.value, suit: maxCard.suitRank, maxCard };
    if (len === 2 && cards[0].value === cards[1].value) return { type: HAND_TYPES.PAIR, value: maxCard.value, suit: maxCard.suitRank, maxCard };
    if (len === 5) return get5CardType(cards, maxCard);

    return { type: HAND_TYPES.INVALID };
}

function get5CardType(cards, maxCard) {
    const counts = {};
    cards.forEach(c => { counts[c.value] = (counts[c.value] || 0) + 1; });
    const values = Object.values(counts);

    if (values.includes(4)) {
        const fourVal = parseInt(Object.keys(counts).find(k => counts[k] === 4));
        return { type: HAND_TYPES.FOUR_OF_A_KIND, value: fourVal, suit: 4, maxCard };
    }
    if (values.includes(3) && values.includes(2)) {
        const threeVal = parseInt(Object.keys(counts).find(k => counts[k] === 3));
        return { type: HAND_TYPES.FULL_HOUSE, value: threeVal, suit: 0, maxCard };
    }

    let isStraight = true;
    for (let i = 0; i < 4; i++) {
        if (cards[i+1].value - cards[i].value !== 1) { isStraight = false; break; }
    }
    
    const isFlush = cards.every(c => c.suitRank === cards[0].suitRank);
    if (isStraight && isFlush) return { type: HAND_TYPES.STRAIGHT_FLUSH, value: maxCard.value, suit: maxCard.suitRank, maxCard };
    if (isStraight) return { type: HAND_TYPES.STRAIGHT, value: maxCard.value, suit: maxCard.suitRank, maxCard };

    return { type: HAND_TYPES.INVALID };
}

function compareHands(current, last) {
    const rank5 = { [HAND_TYPES.STRAIGHT]: 1, [HAND_TYPES.FULL_HOUSE]: 2, [HAND_TYPES.FOUR_OF_A_KIND]: 3, [HAND_TYPES.STRAIGHT_FLUSH]: 4 };
    
    if (current.type !== last.type) {
        if (rank5[current.type] && rank5[last.type] && rank5[current.type] > rank5[last.type]) {
            return { valid: true, ...current };
        }
        return { valid: false, msg: "牌型不符！" };
    }

    if (current.value > last.value) return { valid: true, ...current };
    if (current.value === last.value && current.suit > last.suit) return { valid: true, ...current };

    return { valid: false, msg: "你的牌不夠大！" };
}
