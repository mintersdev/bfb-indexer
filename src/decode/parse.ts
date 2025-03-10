export function parseAddress(address: string): string | null {
    try {
        if (!address.startsWith('0x')) {
            address = '0x' + address
        }
        const parsed = BigInt(address).toString(16)
        return '0x' + parsed.padStart(64, '0')
    } catch (e) {
        console.log(e)
        return null
    }
}

export const RequestTypes = [
    "subscribe",
    "unsubscribe",
    "setaddress",
    "get",
    "getbattles",
    "getquest",
    "getwarstats",
];

export function parseMessage(message: string): { data: any, error: string | null } {
    try {
        const data = JSON.parse(message);
        if (!RequestTypes.includes(data.type)) {
            throw new Error("Invalid message type");
        }
        switch (data.type) {
            case "subscribe":
                if (!data.group && typeof data.battleId !== "number") {
                    throw new Error("[subscribe] Missing group");
                }
                break;
            case "unsubscribe":
                if (!data.group) {
                    throw new Error("[unsubscribe] Missing group");
                }
                break;
            case "setaddress":
                if (!data.address) {
                    throw new Error("[setaddress] Missing address");
                }
                if (!parseAddress(data.address)) {
                    throw new Error("[setaddress] Invalid address");
                }
                break;
            case "get":
                if (!data.group && typeof data.battleId !== "number") {
                    throw new Error("[get] Missing id");
                }
                break;
            case "getbattles":
                break;
            case "getquest":
                if (!data.player) {
                    throw new Error("[getquest] Missing player");
                }
                break;
            case "getwarstats":
                break;
        }

        return { data, error: null };
    } catch (e) {
        if (e instanceof Error) {
            return { data: null, error: e.message };
        }
        return { data: null, error: "Invalid message" };
    }
}
