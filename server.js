const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const ONECOMPILER_API = "https://api.onecompiler.com/v1/run";
const API_KEY = process.env.ONECOMPILER_API_KEY;  // ← baca dari environment

app.post("/run", async (req, res) => {
    const { language, files, stdin } = req.body;
    if (!language || !files || !Array.isArray(files)) {
        return res.status(400).json({ status: "failed", error: "Invalid payload" });
    }

    // Validasi API_KEY
    if (!API_KEY) {
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
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "failed", error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Backend running at port ${PORT}`);
});
