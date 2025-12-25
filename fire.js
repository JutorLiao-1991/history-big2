// fire.js
// 負責與 Firebase 雲端資料庫溝通

// 1. 設定 Firebase (已填入你的資料)
const firebaseConfig = {
  apiKey: "AIzaSyBKHdCdpuEv-azUYkRxL_jUxnocCUvUlmk",
  authDomain: "history-big2.firebaseapp.com",
  // ⚠️ 注意：這是根據你的專案 ID 推測的資料庫網址。
  // 如果連線失敗，請去 Firebase Console -> Realtime Database 複製正確的網址替換這裡
  databaseURL: "https://history-big2-default-rtdb.firebaseio.com", 
  projectId: "history-big2",
  storageBucket: "history-big2.firebasestorage.app",
  messagingSenderId: "1013913175600",
  appId: "1:1013913175600:web:e8b4206dd73b275c690ff5"
};

// 2. 初始化 Firebase (使用全域變數 firebase)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// 全域變數
let currentRoom = null;
let myName = "";
let mySeat = -1; 

// 3. 進入遊戲 (由 index.html 的按鈕觸發)
function initGame() {
    const nameInput = document.getElementById('username').value;
    const roomInput = document.getElementById('room-id').value;

    if (!nameInput || !roomInput) {
        alert("主公，請留下尊姓大名與房間代號！");
        return;
    }

    myName = nameInput;
    currentRoom = roomInput;

    // 隱藏登入區
    document.getElementById('login-area').style.display = 'none';
    
    // 開始加入房間邏輯
    joinRoom(currentRoom, myName);
}

// 4. 加入房間邏輯
function joinRoom(roomId, playerName) {
    console.log(`正在嘗試加入房間: ${roomId}...`);
    const roomRef = db.ref('rooms/' + roomId);

    roomRef.get().then((snapshot) => {
        if (!snapshot.exists()) {
            console.log("房間不存在，建立新房間...");
            createRoom(roomId, playerName);
        } else {
            console.log("房間已存在，尋找座位...");
            const data = snapshot.val();
            findSeat(roomId, data.players, playerName);
        }
    }).catch((error) => {
        console.error("讀取資料庫失敗:", error);
        alert("連線失敗！請檢查 fire.js 裡的 databaseURL 是否正確。");
    });
}

// 5. 建立新房間
function createRoom(roomId, playerName) {
    db.ref('rooms/' + roomId).set({
        status: 'waiting', 
        turn: 0,           
        players: {
            0: { name: playerName, hand: [] }, // 座位 0
            1: null, 2: null, 3: null         // 其他空著 (用物件存比較保險)
        },
        tableCards: []     
    });
    mySeat = 0;
    alert(`歡迎 ${playerName} 主公，您已建立房間 ${roomId}！(座位 0)`);
    listenToRoom(roomId); 
}

// 6. 找位子坐
function findSeat(roomId, existingPlayers, playerName) {
    let emptySeatIndex = -1;
    
    // 檢查 0, 1, 2, 3 哪個位子是空的 (null)
    for (let i = 0; i < 4; i++) {
        if (!existingPlayers || !existingPlayers[i]) {
            emptySeatIndex = i;
            break;
        }
    }

    if (emptySeatIndex === -1) {
        alert("戰場已滿！請換個房間。");
        location.reload(); 
        return;
    }

    // 坐下
    db.ref(`rooms/${roomId}/players/${emptySeatIndex}`).set({
        name: playerName,
        hand: []
    });
    mySeat = emptySeatIndex;
    alert(`歡迎 ${playerName} 主公，加入房間 ${roomId} 成功！(座位 ${mySeat})`);
    listenToRoom(roomId);
}

// 7. 監聽房間變化 (核心同步功能)
function listenToRoom(roomId) {
    db.ref('rooms/' + roomId).on('value', (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        // 呼叫 Vue 更新畫面
        if (window.updateUI) {
            window.updateUI(data);
        }
    });
}

// 8. 上傳出牌動作
function sendPlayAction(cards) {
    if (!currentRoom) return;
    
    // 更新桌面上的牌
    db.ref(`rooms/${currentRoom}/tableCards`).set(cards);
    
    // 換下一個人 (簡單邏輯)
    let nextTurn = (mySeat + 1) % 4;
    db.ref(`rooms/${currentRoom}/turn`).set(nextTurn);
}