import { WebSocketServer } from "ws";
import { parseMessage } from "../decode/parse";
import { getSets } from "../getters";
import { addClient, addToGroup, assignClientToAddress, removeClient, removeFromGroup, subscriptionGroups } from "./clients";
import express from "express";
import cors from "cors";

const API_PORT = process.env.API_PORT ? Number(process.env.API_PORT) : 8082;
const WS_PORT = process.env.WS_PORT ? Number(process.env.WS_PORT) : 8081;

const ws = new WebSocketServer({ port: WS_PORT });

ws.on("connection", async (socket) => {
    let playerAddress: string | null = null;
    const clientId: ClientId = Date.now().toString() + Math.floor(Math.random() * 1000);
    addClient(clientId, socket);
    socket.send(JSON.stringify({
        type: "connected"
    }));

    socket.on("message", (message) => {
        const { data, error } = parseMessage(message.toString());
        if (error) {
            socket.send(JSON.stringify({ type: "json error", error: error }));
            return;
        }

        switch (data.type) {
            case "subscribe": {
                const groups = Array.isArray(data.group) ? data.group : [data.group];
                for (const group of groups) {
                    addToGroup(group, clientId);
                }
                if (data.battleId) {
                    addToGroup(`Battle:${data.battleId}`, clientId);
                }
                socket.send(JSON.stringify({ type: "subscribed", group: data.group }));
                break;
            }
            case "unsubscribe": {
                const groups = Array.isArray(data.group) ? data.group : [data.group];
                for (const group of groups) {
                    removeFromGroup(group, clientId);
                }
                if (data.battleId) {
                    removeFromGroup(`Battle:${data.battleId}`, clientId);
                }
                socket.send(JSON.stringify({ type: "unsubscribed", group: data.group }));
                break;
            }
            case "setaddress":
                playerAddress = data.address;
                assignClientToAddress(clientId, data.address);
                socket.send(JSON.stringify({ type: "setaddress", address: data.address }));
                break;
            case "get": {
                getSets(data.group, {
                    playerAddress: data.address ? data.address : playerAddress,
                    battleId: data.battleId
                }).then((result) => {
                    socket.send(JSON.stringify({ type: "state", ...result }));
                }).catch((e) => {
                    socket.send(JSON.stringify({ type: "error", subtype: "get/query", error: e.message }));
                })
                break;
            }
        }

    })

    socket.on("error", (err: any) => {
        removeFromGroup("Default", clientId);
        subscriptionGroups.forEach((_groupClients, group) => {
            removeFromGroup(group, clientId);
        });
        removeClient(clientId);
        console.error("[ws] WebSocket error occurred:", err);
    })

    socket.on("close", () => {
removeFromGroup("Default", clientId);
        subscriptionGroups.forEach((_groupClients, group) => {
            removeFromGroup(group, clientId);
        });
        removeClient(clientId);
    });
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
})

app.listen(API_PORT, () => {
    console.log(`API server started on port ${API_PORT}`);
})

