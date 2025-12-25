// fire.js (修正版)

// 1. 設定 Firebase (這裡不能用 import！)
// 我已經補上你的 Config 和推測的資料庫網址
const firebaseConfig = {
  apiKey: "AIzaSyBKHdCdpuEv-azUYkRxL_jUxnocCUvUlmk",
  authDomain: "history-big2.firebaseapp.com",
  // ⚠️ 如果連線後還是沒反應，請確認這個網址是否正確 (去 Firebase Console 看)
  databaseURL: "https://history-big2-default-rtdb.firebaseio.com",
  projectId: "history-big2",
  storageBucket: "history-big2.firebasestorage.app",
  messagingSenderId: "1013913175600",
  appId: "1:1013913175600:web:e8b4206dd73b275c690ff5"
};

// 2. 初始化 (檢查是否已經載入 SDK)
if (typeof firebase === 'undefined') {
    console.error("錯誤：找不到 Firebase SDK！請檢查 index.html 是否有引入 firebase-app-compat.js");
    alert("程式錯誤：找不到 Firebase 元件，請看 F12 Console");
} else {
    // 初始化 Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
}

// 取得資料庫實體
const db = firebase.database();

// 全域變數
let currentRoom = null;
let myName = "";
let mySeat = -1;

// 3. 進入遊戲 (綁定到 window 確保按鈕找得到)
window.initGame = function() {
    console.log("按鈕被點擊了！"); // 測試用
    const nameInput = document.getElementById('username').value;
    const roomInput = document.getElementById('room-id').value;

    if (!nameInput || !roomInput) {
        alert("主公，請留下尊姓大名與房間代號！");
        return;
    }

    myName = nameInput;
    currentRoom = roomInput;

    // 隱藏登入區
    const loginArea = document.getElementById('login-area');
    if (loginArea) loginArea.style.display = 'none';
    
    alert(`歡迎 ${myName} 主公，正在連線到 ${currentRoom}...`);
    
    // 開始連線
    joinRoom(currentRoom, myName);
}

// 4. 加入房間
function joinRoom(roomId, playerName) {
    console.log(`正在讀取房間 ${roomId} 的資料...`);
    const roomRef = db.ref('rooms/' + roomId);

    roomRef.get().then((snapshot) => {
        if (!snapshot.exists()) {
            console.log("房間不存在，建立新房...");
            createRoom(roomId, playerName);
        } else {
            console.log("房間存在，找位子...");
            const data = snapshot.val();
            findSeat(roomId, data.players, playerName);
        }
    }).catch((error) => {
        console.error("Firebase 連線失敗:", error);
        alert("連線失敗！請檢查 F12 Console 的錯誤訊息 (可能是 databaseURL 錯誤)");
    });
}

// 5. 建立房間
function createRoom(roomId, playerName) {
    db.ref('rooms/' + roomId).set({
        status: 'waiting',
        turn: 0,
        players: {
            0: { name: playerName, hand: [] },
            1: null, 2: null, 3: null
        },
        tableCards: []
    }).then(() => {
        mySeat = 0;
        console.log("建立成功！");
        listenToRoom(roomId);
    });
}

// 6. 找位子
function findSeat(roomId, existingPlayers, playerName) {
    let emptySeatIndex = -1;
    // 簡單的找位子邏輯
    for (let i = 0; i < 4; i++) {
        // 如果是 null 或是 undefined 就是空位
        if (!existingPlayers || !existingPlayers[i]) {
            emptySeatIndex = i;
            break;
        }
    }

    if (emptySeatIndex === -1) {
        alert("房間已滿！");
        location.reload();
        return;
    }

    db.ref(`rooms/${roomId}/players/${emptySeatIndex}`).set({
        name: playerName,
        hand: []
    }).then(() => {
        mySeat = emptySeatIndex;
        console.log(`加入成功，座位 ${mySeat}`);
        listenToRoom(roomId);
    });
}

// 7. 監聽
function listenToRoom(roomId) {
    db.ref('rooms/' + roomId).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data && window.updateUI) {
            window.updateUI(data);
        }
    });
}

// 8. 傳送出牌
window.sendPlayAction = function(cards) {
    if (!currentRoom) return;
    db.ref(`rooms/${currentRoom}/tableCards`).set(cards);
    // 簡單換人邏輯
    let nextTurn = (mySeat + 1) % 4;
    db.ref(`rooms/${currentRoom}/turn`).set(nextTurn);
}