const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

const PRIM_BASE = "https://prim.iledefrance-mobilites.fr/marketplace";

// Route santé (utile pour vérifier que le service tourne)
app.get("/", (req, res) => {
  res.send("✅ Proxy PRIM IDFM actif");
});

// Route : prochains passages
app.get("/stop-monitoring", async (req, res) => {
  const { stopId, apiKey, max = 5 } = req.query;

  if (!stopId || !apiKey) {
    return res.status(400).json({ error: "stopId et apiKey requis" });
  }

  const url = `${PRIM_BASE}/stop-monitoring?MonitoringRef=${encodeURIComponent(stopId)}&MaximumStopVisits=${max}`;
  console.log("Appel PRIM:", url);

  try {
    const upstream = await fetch(url, {
      headers: { "apiKey": apiKey, "Accept": "application/json" },
    });
    const data = await upstream.json();
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
});

// Route : position véhicules
app.get("/vehicle-monitoring", async (req, res) => {
  const { lineId, apiKey } = req.query;

  if (!lineId || !apiKey) {
    return res.status(400).json({ error: "lineId et apiKey requis" });
  }

  const url = `${PRIM_BASE}/vehicle-monitoring?LineRef=${encodeURIComponent(lineId)}`;

  try {
    const upstream = await fetch(url, {
      headers: { apiKey, Accept: "application/json" },
    });
    const data = await upstream.json();
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy PRIM démarré sur le port ${PORT}`);
});
