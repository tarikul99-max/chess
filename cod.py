<!DOCTYPE html>
<html>
<head>
    <title>JS Chess Game</title>
</head>
<body>
    <canvas id="chessBoard" width="400" height="400" style="border:2px solid #333;"></canvas>
    <p id="status">সাদা চাল দিন</p>

    <script>
        const canvas = document.getElementById("chessBoard");
        const ctx = canvas.getContext("2d");
        const size = 50;

        // বোর্ড ড্র করার ফাংশন
        function drawBoard() {
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    ctx.fillStyle = (r + c) % 2 === 0 ? "#f0d9b5" : "#b58863";
                    ctx.fillRect(c * size, r * size, size, size);
                }
            }
        }

        // মাউস ক্লিক হ্যান্ডলার
        canvas.addEventListener("mousedown", function(e) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const col = Math.floor(x / size);
            const row = Math.floor(y / size);
            
            document.getElementById("status").innerText = `আপনি ক্লিক করেছেন: কলাম ${col}, সারি ${row}`;
            // এখানে আপনার পিস মুভমেন্ট লজিক যুক্ত হবে
        });

        drawBoard();
    </script>
</body>
</html>
