import type WebSocket from "ws"


const clients = new Map<ClientId, WebSocket>()
const clientFilters = new Map<ClientId, ClientFilter>()
export const subscriptionGroups = new Map<SubGroup, ClientId[]>()

const DefaultClientFilter = {
    address: "",
    captains: []
}

export function addClient(clientId: ClientId, ws: WebSocket) {
    clients.set(clientId, ws)
}

export function removeClient(clientId: ClientId) {
    clients.delete(clientId)
    clientFilters.delete(clientId)
}

export async function sendToAll(message: Update) {
    for (const ws of clients.values()) {
        ws.send(JSON.stringify({
            type: "update",
            ...message
        }))
    }
}

export function assignClientToAddress(clientId: ClientId, address: string) {
    const currentFilter = clientFilters.get(clientId)
    let filter: ClientFilter

    if (currentFilter) {
        filter = { ...currentFilter, address }
    } else {
        filter = { ...DefaultClientFilter, address }
    }
    clientFilters.set(clientId, filter)
}

export async function sendToGroup(group: SubGroup, message: Update) {
    const groupClients = subscriptionGroups.get(group)
    if (groupClients) {
        for (const clientId of groupClients) {
            const ws = clients.get(clientId)
            if (ws) {
                ws.send(JSON.stringify({
                    type: "update",
                    ...message
                }))
            }
        }
    }
}

// Players and LootboxOpened table specific function
// Can be used for every event with player field
export async function sendToPlayerUpdate(event: Update, playerFieldName: string = "player") {
    const address = "0x" + event.new?.[playerFieldName].slice(2).toLowerCase()
    const clientConns = Array.from(clientFilters.entries())
        .filter(([key, value]) => value.address == address)
        .map(([key]) => key)
    for (const clientId of clientConns) {
        const ws = clients.get(clientId)
        if (ws) {
            ws.send(JSON.stringify({
                type: "update",
                ...event
            }))
        }
    }
}

export async function addToGroup(group: SubGroup, clientId: ClientId) {
    const groupClients = subscriptionGroups.get(group)
    if (groupClients) {
        groupClients.push(clientId)
    } else {
        subscriptionGroups.set(group, [clientId])
    }
}

export async function removeFromGroup(group: SubGroup, clientId: ClientId) {
    const groupClients = subscriptionGroups.get(group)
    if (groupClients) {
        const index = groupClients.indexOf(clientId)
        if (index > -1) {
            groupClients.splice(index, 1)
        }
    }
}
