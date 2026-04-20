const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const ONECOMPILER_API = "https://api.onecompiler.com/v1/run";
const API_KEY = process.env.ONECOMPILER_API_KEY;

// Tambahkan endpoint GET / untuk test
app.get('/', (req, res) => {
    res.json({ status: "OK", message: "Backend BinariApp is running" });
});

app.post("/run", async (req, res) => {
    const { language, files, stdin } = req.body;
    
    console.log("Received request:", { language, filesCount: files?.length });
    
    if (!language || !files || !Array.isArray(files)) {
        return res.status(400).json({ status: "failed", error: "Invalid payload" });
    }

    if (!API_KEY) {
        console.error("API_KEY is missing!");
        return res.status(500).json({ status: "failed", error: "API key not configured on server" });
    }

    const payload = { language, stdin: stdin || "", files };

    try {
        const response = await fetch(ONECOMPILER_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": API_KEY
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        console.log("OneCompiler response received");
        res.json(data);
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ status: "failed", error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Backend running at port ${PORT}`);
    console.log(`✅ API Key configured: ${API_KEY ? "YES" : "NO"}`);
});
