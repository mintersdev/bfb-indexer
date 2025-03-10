//NOTE - In order to add any table to a group, you need to add it to the groupToComponents object below, also if table belongs to "Battle" group, you need to add name of the identifier in battle_table_idendifiers object below.

// export const groupToComponents: Record<RedisSet, string[]> = {
// partial RedisSet
export const groupToComponents: Partial<Record<RedisSet, string[]>> = {
    Default: [
        "LootboxOpened",
        "Players",
        "War",
        "WarConfig",
        "PlayerDonated",
        "Army",
        "CallToArms",
        "Captain",
        "Rewards",
        "LocationBattleFinished",
        "QuestlineRewards",
        "FinalQuest",
        "RepeatingQuests",
    ],

    Battle: [
        "Units",
        "UnitsCombat",
        "UnitMoved",
        "MeleeAttack",
        "RangeAttack",
        "GateAttack",
        "HealerSkill",
        "ArcherSkill",
        "SquireSkill",
        "BombSkill",
        "BlockerSkill",
        "MageSkill",
        "BarbarianSkill",
        "AlchemistSkill",
        "ButcherSkill",
        "ShamanSkill",
        "DruidSkill",
        "PhantomleechSkill",
        "AssassinSkill",
        "CannonSkill",
        "BarbarianDetonate",
        "HealerTarget",
        "DruidBuffs",
        "PomegranatePulverizer",
        "GrenadeThrown",
        "ResurectionRaisinUsed",
        "ApocalypticAppleUsed",
        "OneBlastBerryUsed",
        "ChaosChocolateUsed",
        "InvincibleIcingUsed",
        "SouffleSurgeUsed",
        "QuantumQuicheUsed",
        "StomachBittersUsed",
        "TabulaRiceUsed",
        "PoisonDamage",
        "PoisonedUnits",
        "BarbarianTargets",
        "PhantomleechManaDrain",
        "AssassinGateDamageIncrease",
        "EnergizingEspressoUsed",
    ],

    Map: [
        "ReforgerUsed",
        "TeamLeft",
        "TeamRight",
        "Buildings",
        "Locations",
        "Battles",
        "Siege",
        "PlayerQuestProgress",
        "DailyQuests",
    ],
};

// Tables that are dispatched by a player key
export const playerBasedTables = [
    "Players",
    "LootboxOpened",
    "PlayerQuestProgress",
    "Rewards",
    "DailyQuests",
    "DiscordNickname",
    "RepeatingQuests",
];

const tables: string[] = [];
for (const group in groupToComponents) {
    const groupTables = groupToComponents[group as RedisSet];
    if (groupTables) {
        tables.push(...groupTables);
    }
}
export const allTables = tables;

// these tables are identified via unit ID
export const battle_table_idendifiers: { [key: string]: string } = {
    // NOTE if table has unit ID as table key it MUST NOT be added to this object. 
    // NOTE If table has unit ID not as key it MUST be added to this object with information where this unit ID is located

    // Units: "id",
    UnitsCombat: "id",
    UnitMoved: "unitId",
    MeleeAttack: "attacker",
    RangeAttack: "attacker",
    GateAttack: "unitId",
    HealerSkill: "casterId",
    ArcherSkill: "casterId",
    SquireSkill: "casterId",
    BombSkill: "casterId",
    BlockerSkill: "casterId",
    MageSkill: "casterId",
    BarbarianSkill: "casterId",
    AlchemistSkill: "casterId",
    ButcherSkill: "casterId",
    ShamanSkill: "casterId",
    DruidSkill: "casterId",
    PhantomleechSkill: "casterId",
    AssassinSkill: "casterId",
    CannonSkill: "casterId",
    BarbarianDetonate: "unitId",
    HealerTarget: "healer",
    DruidBuffs: "druid",
    PomegranatePulverizer: "id",
    GrenadeThrown: "itemOwner",
    ResurectionRaisinUsed: "unitId",
    ApocalypticAppleUsed: "ownerId",
    OneBlastBerryUsed: "itemOwner",
    ChaosChocolateUsed: "ownerId",
    InvincibleIcingUsed: "ownerId",
    SouffleSurgeUsed: "ownerId",
    QuantumQuicheUsed: "ownerId",
    StomachBittersUsed: "ownerId",
    TabulaRiceUsed: "ownerId",
    PoisonDamage: "id",
    PoisonedUnits: "id",
    BarbarianTargets: "barbarian",
    PhantomleechManaDrain: "id",
    AssassinGateDamageIncrease: "unitId",
    EnergizingEspressoUsed: "unitId",
};

// Create a mapping of full names to groups
export const componentToGroup: Record<string, RedisSet> = {};
for (const group in groupToComponents) {
    if (groupToComponents.hasOwnProperty(group)) {
        const components = groupToComponents[group as RedisSet];
        if (!components) {
            continue;
        }
        for (const fullName of components) {
            componentToGroup[fullName] = group as RedisSet;
        }
    }
}

// Function to get all components of a specific group
export function getComponentsByGroup(group: RedisSet): string[] | undefined {
    return groupToComponents[group];
}

// Function to get the group of a specific component
export function getGroupByComponent(component: string): RedisSet {
    return componentToGroup[component] || "unknown";
}
