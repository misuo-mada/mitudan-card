const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app); // サーバーの作成
const io = new Server(server); // Socket.IO サーバーの作成
const PORT = process.env.PORT || 3000;

let cards = [
    { id: 1, info: "カード1の秘密情報" },
    { id: 2, info: "カード2の秘密情報" },
    { id: 3, info: "カード3の秘密情報" },
    { id: 4, info: "カード4の秘密情報" },
    { id: 5, info: "カード5の秘密情報" },
    { id: 6, info: "カード6の秘密情報" },
];

let drawnCardsCount = 0;

// Socket.IO サーバーの設定
io.on('connection', (socket) => {
    console.log('プレイヤーが接続しました:', socket.id);

    // 初期化リクエスト
    socket.on('initGame', () => {
        socket.emit('initCards', cards); // 初期カードをクライアントに送信
    });

    // カードを引くリクエスト
    socket.on('drawCard', (index) => {
        if (drawnCardsCount < 3 && cards[index]) {
            const card = cards[index];
            cards[index] = null; // カードを引いたことにする
            drawnCardsCount++;
            socket.emit('cardInfo', { index, info: card.info }); // カード情報を送信
        }
    });

    // ゲームリセット
    socket.on('resetGame', () => {
        cards = [
            { id: 1, info: "アルケミアは事件当日、朝と夕方で服装が違う。" },
            { id: 2, info: "不老不死の魔法の使用記録が見つかった。" },
            { id: 3, info: "事件当日、不老不死の魔法と炎の魔法の使用記録がある。" },
            { id: 4, info: "クロウは研究で動物を殺していたがきちんと供養していた。" },
            { id: 5, info: "ロックはクロウのことを父親のような存在と思っていた。" },
            { id: 6, info: "事件当日、４人以外の存在は確認できていない。" },
        ];
        drawnCardsCount = 0;
        socket.emit('gameReset', { cards }); // 初期化カードを送信
    });
});

// 静的ファイルの提供
app.use(express.static(__dirname + '/public'));

// サーバーの起動 (server.listen を使用)
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
