const tables = {
    DiscordNickname: {
        schema: {
            player: "address",
            isNicknameSet: "bool",
            nickname: "string",
        },
        key: ["player"],
    },
    TeamLeft: {
        schema: {
            warId: "uint32",
            bombHouseLevel: "uint32",
            blockerHouseLevel: "uint32",
            archerHouseLevel: "uint32",
            squireHouseLevel: "uint32",
            healerHouseLevel: "uint32",
            mageHouseLevel: "uint32",
            barbarianHouseLevel: "uint32",
            alchemistHouseLevel: "uint32",
            butcherHouseLevel: "uint32",
            shamanHouseLevel: "uint32",
            assassinHouseLevel: "uint32",
            druidHouseLevel: "uint32",
            spellcannonHouseLevel: "uint32",
            phantomleechHouseLevel: "uint32",
        },
        key: ["warId"],
    },

    TeamRight: {
        schema: {
            warId: "uint32",
            bombHouseLevel: "uint32",
            blockerHouseLevel: "uint32",
            archerHouseLevel: "uint32",
            squireHouseLevel: "uint32",
            healerHouseLevel: "uint32",
            mageHouseLevel: "uint32",
            barbarianHouseLevel: "uint32",
            alchemistHouseLevel: "uint32",
            butcherHouseLevel: "uint32",
            shamanHouseLevel: "uint32",
            assassinHouseLevel: "uint32",
            druidHouseLevel: "uint32",
            spellcannonHouseLevel: "uint32",
            phantomleechHouseLevel: "uint32",
        },
        key: ["warId"],
    },

    GlobalBattleStats: {
        schema: {
            battleId: "bytes32",
            isTeamRight: "bool",
            unitsPlaced: "uint32",
        },
        key: ["battleId", "isTeamRight"],
    },

    PlayerBattleStats: {
        schema: {
            player: "address",
            battleId: "bytes32",
            unitsPlaced: "uint32",
        },
        key: ["player", "battleId"],
    },

    Gold: {
        schema: {
            battleGoldEmitted: "uint256"
        },
        key: [],
    },

    Lootboxes: {
        schema: {
            owner: "address",
            commitBlock: "uint256",
        },
        key: ["owner"],
    },

    ProcessParams: {
        schema: {
            battleId: "bytes32",
            leftProcessIndex: "uint32",
            rightProcessIndex: "uint32",
            leftMaxIndex: "uint32",
            rightMaxIndex: "uint32",
            leftProcessFinished: "bool",
            rightProcessFinished: "bool",
            leftNoUnitsLeft: "bool",
            rightNoUnitsLeft: "bool",
            deleteBatchSize: "uint32",
        },
        key: ["battleId"],
    },

    Units: {
        schema: {
            id: "bytes32",
            battleId: "bytes32",
            unitType: "UnitType",
            x: "uint32",
            y: "uint32",
            hp: "int32",
            maxHp: "int32",
            mana: "int32",
            manaRegen: "int32",
            castMana: "int32",
            maxMana: "int32",
            isTeamRight: "bool",
            owner: "address",
            level: "uint32",
            title: "string",
        },
        key: ["id"],
    },

    UnitsCombat: {
        schema: {
            id: "bytes32",
            meleeDamage: "int32",
            rangeDamage: "int32",
            critDamage: "int32",
            critChance: "uint32",
            gateDamage: "int32",
            attackRange: "uint32",
            item: "uint32",
        },
        key: ["id"],
    },

    UnitsSkillsModifiers: {
        schema: {
            isTeamRight: "bool",
            shamanDamageIncrease: "int32", //percent increase
            shamanBonusDamagePercent: "int32", //percent of enemy hp
            shamanManaSteal: "int32",
            butcherDamageIncreaseThirdStage: "int32", //percent increase
            butcherHealAmount: "int32",
            healerHealAmount: "int32",
            healerBondedUnitHealIncrease: "int32", //percent increase
            squireDamageIncrease: "int32", //percent increase
            bombCritDamageIncrease: "int32", //percent increase
            bombCritChanceIncrease: "uint32", //percent increase 
            archerDamageIncrease: "int32", //percent increase
            mageSubtargetsDamage: "int32", //percent of default damage for each target
            mageManaGenerationForCrit: "int32",
            alchemistManaHeal: "int32",
            alchemistPoisonMaxStacks: "int32",
            alchemistShroomRange: "uint32",
            alchemistShroomDamage: "int32", //max hp damage dealt per stack
            assassinGateDamageIncrease: "int32", //flat increase 
            assassinSkillDamageIncrease: "int32", //percent increase
            spellCannonDamageIncrease: "int32", //percent increase
            spellCannonSkillHitChancePercentage: "uint32",
            spellCannonTargetsCount: "uint32",
            phantomleechManaDrain: "int32",
            phantomleechGateDamageManaTreshold: "int32",
            phantomleechGateDamageOnSkill: "int32",
            barbarianDamegePercentPerHit: "int32",
            barbarianDamageSumDealtIntoGatePercent: "int32",
            druidBuffAmount: "int32",
        },
        key: ["isTeamRight"],
    },

    UnitConstants: {
        schema: {
            unitType: "UnitType",
            hp: "int32",
            mana: "int32",
            manaRegen: "int32",
            castMana: "int32",
            maxMana: "int32",
            meleeDamage: "int32",
            rangeDamage: "int32",
            critDamage: "int32",
            critChance: "uint32",
            gateDamage: "int32",
            attackRange: "uint32",
        },
        key: ["unitType"],
    },

    ItemRarityConstants: {
        schema: {
            grayItems: "uint32[9]",
            greenItems: "uint32[17]",
            blueItems: "uint32[21]",
            purpleItems: "uint32[20]",
            uniqueItems: "uint32[2]",
        },
        key: [],
    },

    //percentages 
    UnitUpgrade: {
        schema: {
            buildingType: "UnitType",
            isTeamRight: "bool",
            level: "uint32",
            hp: "int32",
            mana: "int32",
            manaRegen: "int32",
            castMana: "int32",
            meleeDamage: "int32",
            rangeDamage: "int32",
            critDamage: "int32",
            critChance: "uint32",
            gateDamage: "int32",
            attackRange: "uint32",
            skillModifier: "int32"
        },
        key: ["buildingType", "isTeamRight"],
    },

    MapUnits: {
        schema: {
            battleId: "bytes32",
            x: "uint32",
            y: "uint32",
            unitId: "bytes32",
        },
        key: ["battleId", "x", "y"],
    },

    LeftQueue: {
        schema: {
            id: "uint32",
            battleId: "bytes32",
            unitId: "bytes32",
        },
        key: ["id", "battleId"],
    },

    RightQueue: {
        schema: {
            id: "uint32",
            battleId: "bytes32",
            unitId: "bytes32"
        },
        key: ["id", "battleId"],
    },

    Randomness: {
        schema: {
            blockNumber: "uint256",
            value: "uint256",
            randomnessActive: "bool",
        },
        key: [],
    },

    //unit specific tables ========================================================================
    ButcherSkillSequence: {
        schema: {
            id: "bytes32",
            stage: "ButcherSkillStage",
        },
        key: ["id"],
    },

    DruidForm: {
        schema: {
            id: "bytes32",
            isBear: "bool",
        },
        key: ["id"],
    },

    BarbarianTargets: {
        schema: {
            barbarian: "bytes32",
            target: "bytes32",
            hitCount: "int32",
            totalDamageDealt: "int32",
        },
        key: ["barbarian"],
    },

    HealerTarget: {
        schema: {
            healer: "bytes32",
            bondedTarget: "bytes32",
        },
        key: ["healer"],
    },

    PhantomleechManaDrain: {
        schema: {
            id: "bytes32",
            manaDrained: "int32",
        },
        key: ["id"],
    },

    PoisonedUnits: {
        schema: {
            id: "bytes32",
            poisonStack: "int32",
        },
        key: ["id"],
    },

    PoisonDamage: {
        schema: {
            id: "bytes32",
        },
        type: "offchainTable",
        key: [],
    },

    //========== items =====================================================
    PomegranatePulverizer: {
        schema: {
            id: "bytes32",
            x: "uint32",
            y: "uint32",
            thrown: "bool",
        },
        key: ["id"],
    },

    InvincibleIcingIIITarget: {
        schema: {
            ownerId: "bytes32",
            target: "bytes32",
        },
        key: ["ownerId"]
    },

    SouffleSurgeTargets: {
        schema: {
            ownerId: "bytes32",
            itemType: "ItemType",
            targets: "bytes32[]",
        },
        key: ["ownerId"]
    },

    ChaosChocolateTargetLane: {
        schema: {
            ownerId: "bytes32",
            lane: "uint32",
        },
        key: ["ownerId"]
    },

    //========= Design ballancing tables =======================================================================

    UnitDesign: {
        schema: {
            id: "bytes32",
            damageDealt: "int32",
            damageHealed: "int32",
            manaGained: "int32",
        },
        key: ["id"],
    },

    UnitTypeDesign: {
        schema: {
            unitType: "UnitType",
            damageDealt: "int32",
            damageHealed: "int32",
            manaGained: "int32",
        },
        key: ["unitType"],
    },

    //========= Buildings Tables ====================================================================

    Buildings: {
        schema: {
            building: "BuildingType",
            isTeamRight: "bool",
            totalResourcesStaked: "uint256[5]",
        },
        key: ["building", "isTeamRight"],
    },

    //========= Village Tables ====================================================================

    VillageStructures: {
        schema: {
            player: "address",
            level: "uint32[3]",
            structureType: "uint32[3]"
        },
        key: ["player"],
    },

    Generators: {
        schema: {
            player: "address",
            generator: "StructureType",
            lastTimeCollected: "uint256",
        },
        key: ["player", "generator"],
    },

    //========= War tables ====================================================================

    Players: {
        schema: {
            player: "address",
            isTeamRight: "bool",
            lootboxes: "uint32",
            ArmyGeneral: "bytes32",
            latestWarId: "uint32",
            votingPowerSpent: "uint256",
            warPrisoners: "uint32",
            warPermitBalance: "uint256",
            title: "string",
            items: "uint32[69]",
            resources: "uint256[5]",
            units: "uint32[14]",
            ArmyCaptain: "bytes32[]",
        },
        key: ["player"],
    },

    Rewards: {
        schema: {
            player: "address",
            lootboxes: "uint32",
            battleRewards: "uint256[5]",
        },
        key: ["player"],
    },

    Army: {
        schema: {
            armyId: "bytes32",
            warId: "uint32",
            armyState: "ArmyState", //Idle, Fighting
            captains: "address[]", //captains[0] is the army leader, the only person that can disband the army
            pendingInvitations: "address[]",
        },
        key: ["armyId"],
    },

    CallToArms: {
        schema: {
            captain: "address",
            armyId: "bytes32",
            status: "CallToArmsStatus", //0 - not invited, 1 - pending invite, 2 - accepted
        },
        key: ["captain", "armyId"],
    },

    Locations: {
        schema: {
            id: "uint32",
            isSiegeLocation: "bool",
            isTeamRight: "bool",
            hp: "int32",
            maxHp: "int32",
            width: "uint32",
            height: "uint32",
            resource: "ResourceType",
            lastClaimVp: "uint256",
            repairCostTier: "uint32",
            mapType: "MapType",
            neighbours: "uint32[]",
            ongoingBattles: "bytes32[]"
        },
        key: ["id"],
    },

    Artillery: {
        schema: {
            isTeamRight: "bool",
            warId: "uint32",
            kebabRocket: "uint256[4]", //VP +
            mustardGas: "uint256[4]", //all HP -x
            fatMandarin: "uint256[4]", //all ManaRegen -x
            allocation: "uint256[3]", //votes casted for kebab, mustard, fat
        },
        key: ["warId", "isTeamRight"],
    },

    War: {
        schema: {
            warId: "uint32",
            winnerTeamRight: "bool",
            startTime: "uint256", //NOTE when war end it is being set to war end time, after 1 month claims are locked, remaining rewards transfered to trasury and time set to 0
            leftVictoryPoints: "uint32",
            rightVictoryPoints: "uint32",
            warState: "WarState",
            leftCapitalId: "uint32",
            rightCapitalId: "uint32",
            goldClaimed: "uint256",
        },
        key: ["warId"],
    },

    WarStats: {
        schema: {
            warId: "uint32",
            leftTreasury: "uint256",
            rightTreasury: "uint256",
            unitsBought: "uint256[14]",
        },
        key: ["warId"],
    },

    PlayerContribution: {
        schema: {
            player: "address",
            warId: "uint256",
            gold: "uint256",
            unitsPlaced: "uint32",
            unitsBought: "uint32",
        },
        key: ["player", "warId"],
    },

    Siege: {
        schema: {
            warId: "uint32",
            teamLeftVictoryPoints: "uint32",
            teamRightVictoryPoints: "uint32",
        },
        key: ["warId"]
    },

    SiegeGoldSpent: {
        schema: {
            warId: "uint32",
            goldSpent: "uint256",
        },
        key: ["warId"]
    },

    Battles: {
        schema: {
            id: "bytes32",
            warId: "bytes32",
            winner: "BattleWinner",
            initTime: "uint256",
            battleState: "BattleState",
            leftGateHp: "int32",
            rightGateHp: "int32",
            gateBleed: "int32",
            location: "uint32",
            defenderUnitPlaced: "bool",
            attackingArmy: "bytes32",
            defendingArmy: "bytes32", //0 if public defense
            leftReady: "bool",
            rightReady: "bool",
            publicDefenders: "address[]", //length 0 if private defense
        },
        key: ["id"],
    },

    WarConfig: {
        schema: {
            warId: "uint32",
            battleId: "uint32",
        },
        key: [],
    },


    //======================== QUESTS =====================

    //contains all quest types requirements
    QuestRequirements: {
        schema: {
            questId: "uint32",
            requirement: "uint32",
            nextQuests: "uint32[]",
        },
        key: ["questId"],
    },

    PlayerQuestProgress: {
        schema: {
            player: "address",
            questId: "uint32",
            progress: "uint32",
            unlocked: "bool",
            completed: "bool",
        },
        key: ["player", "questId"],
    },

    DailyQuests: {
        schema: {
            player: "address",
            questId: "uint32",
            progress: "uint32",
            lastClaimed: "uint256",
        },
        key: ["player", "questId"],
    },

    RepeatingQuests: {
        schema: {
            player: "address",
            questId: "uint32",
            progress: "uint32",
        },
        key: ["player", "questId"],
    },

    QuestlineRewards: {
        schema: {
            player: "address",
            spoonQualified: "bool",
            spoonXP: "uint32",
            forkQualified: "bool",
            forkXP: "uint32",
        },
        key: ["player"],
    },

    //========= EVENTS ============================================================================== 


    LocationBattleFinished: {
        schema: {
            locationId: "uint32",
            battleId: "bytes32",
            damageDealt: "int32",
        },
        type: "offchainTable",
        key: [],
    },

    //artillery events
    KebabRocketLaunched: {
        schema: {
            warId: "uint32",
            isTeamRight: "bool",
            victoryPoints: "uint32",
        },
        type: "offchainTable",
        key: [],
    },

    MustardGasLaunched: {
        schema: {
            warId: "uint32",
            locationId: "uint32",
            isTeamRight: "bool",
            hpDecrease: "int32",
        },
        type: "offchainTable",
        key: [],
    },

    FatMandarinLaunched: {
        schema: {
            warId: "uint32",
            locationId: "uint32",
            isTeamRight: "bool",
            manaRegenDecrease: "int32",
        },
        type: "offchainTable",
        key: [],
    },

    PlanningPhase: {
        schema: {
            planningId: "uint32"
        },
        type: "offchainTable",
        key: [],
    },

    BattlePhase: {
        schema: {
            battleId: "uint32"
        },
        type: "offchainTable",
        key: [],
    },

    UnitSpawned: {
        schema: {
            unitId: "bytes32",
            unitType: "UnitType",
            x: "uint32",
            y: "uint32",
            cost: "uint256",
        },
        type: "offchainTable",
        key: [],
    },

    UnitMoved: {
        schema: {
            unitId: "bytes32",
            x: "uint32",
            y: "uint32",
            newX: "uint32",
            newY: "uint32",
            isQuiched: "bool",
        },
        type: "offchainTable",
        key: [],
    },

    MeleeAttack: {
        schema: {
            attacker: "bytes32",
            defender: "bytes32",
            damage: "int32",
            isCrit: "bool",
        },
        type: "offchainTable",
        key: [],
    },

    RangeAttack: {
        schema: {
            attacker: "bytes32",
            defender: "bytes32",
            damage: "int32",
            isCrit: "bool",
        },
        type: "offchainTable",
        key: [],
    },

    GateAttack: {
        schema: {
            unitId: "bytes32",
            isTeamRightGate: "bool",
            damage: "int32",
            killUnit: "bool",
        },
        type: "offchainTable",
        key: [],
    },

    BarbarianDetonate: {
        schema: {
            unitId: "bytes32",
            damage: "int32",
        },
        type: "offchainTable",
        key: [],
    },

    BattleFinished: { //??????
        schema: {
            winner: "uint32"
        },
        type: "offchainTable",
        key: [],
    },

    ProcessingUnit: {
        schema: {
            unitId: "bytes32",
        },
        type: "offchainTable",
        key: [],
    },

    IterationFinished: {
        schema: {
            leftIndex: "uint32",
            rightIndex: "uint32",
        },
        type: "offchainTable",
        key: [],
    },

    PlayerDonated: {
        schema: {
            player: "address",
            isTeamRight: "bool",
            building: "BuildingType",
            resources: "uint256[5]",
        },
        type: "offchainTable",
        key: [],
    },

    GeneratorResourcesCollected: {
        schema: {
            player: "address",
            wood: "uint256",
            stone: "uint256",
            iron: "uint256",
        },
        type: "offchainTable",
        key: [],
    },

    //=== SKILLS EVENTS ============================================================================
    HealerSkill: {
        schema: {
            casterId: "bytes32",
            unit1: "bytes32",
            unit2: "bytes32",
            unit3: "bytes32",
            unit4: "bytes32",
            unit5: "bytes32",
            hasBondedUnit: "bool",
        },
        type: "offchainTable",
        key: [],
    },

    ArcherSkill: {
        schema: {
            casterId: "bytes32",
            target1: "bytes32",
            dmg1: "int32",
            target2: "bytes32",
            dmg2: "int32",
            target3: "bytes32",
            dmg3: "int32",
        },
        type: "offchainTable",
        key: [],
    },

    SquireSkill: {
        schema: {
            casterId: "bytes32",
            target1: "bytes32",
            target2: "bytes32",
            dmg: "int32"
        },
        type: "offchainTable",
        key: [],
    },

    BombSkill: {
        schema: {
            casterId: "bytes32",
            unit1: "bytes32",
            unit2: "bytes32",
            unit3: "bytes32",
            unit4: "bytes32",
        },
        type: "offchainTable",
        key: [],
    },

    BlockerSkill: {
        schema: {
            casterId: "bytes32",
            target: "bytes32",
            reflectedDamage: "int32",
            isCrit: "bool",
            damageType: "DamageType",
        },
        type: "offchainTable",
        key: [],
    },

    MageSkill: {
        schema: {
            casterId: "bytes32",
            target1: "bytes32",
            target2: "bytes32",
            target3: "bytes32",
            target4: "bytes32",
            isCrit: "bool",
        },
        type: "offchainTable",
        key: [],
    },

    BarbarianSkill: {
        schema: {
            casterId: "bytes32",
            newPercentageDamage: "int32",
        },
        type: "offchainTable",
        key: [],
    },

    AlchemistSkill: {
        schema: {
            casterId: "bytes32",
            targets0: "bytes32[]",
            targets1: "bytes32[]",
            targets2: "bytes32[]",
            targets3: "bytes32[]",
        },
        type: "offchainTable",
        key: [],
    },

    ButcherSkill: {
        schema: {
            casterId: "bytes32",
            stage: "ButcherSkillStage",
            target: "bytes32",
            newTargetX: "uint32",
            reorderedUnit: "bytes32",
            reorderedUnitNewX: "uint32",
            healAmount: "int32",
            damage: "int32", //only in PowerAttack
        },
        type: "offchainTable",
        key: [],
    },

    ShamanSkill: {
        schema: {
            casterId: "bytes32",
            changesToMelee: "bool",
        },
        type: "offchainTable",
        key: [],
    },

    AssassinGateDamageIncrease: {
        schema: {
            unitId: "bytes32",
        },
        type: "offchainTable",
        key: [],
    },

    AssassinSkill: {
        schema: {
            casterId: "bytes32",
            newX: "uint32",
            target: "bytes32",
        },
        type: "offchainTable",
        key: [],
    },

    DruidSkill: {
        schema: {
            casterId: "bytes32",
            changedToBear: "bool",
        },
        type: "offchainTable",
        key: [],
    },

    DruidBuffs: {
        schema: {
            druid: "bytes32",
            target1: "bytes32",
            target2: "bytes32",
            isHeal: "bool",
            value: "int32",
        },
        type: "offchainTable",
        key: [],
    },

    CannonSkill: {
        schema: {
            casterId: "bytes32",
            targets: "bytes32[]",
        },
        type: "offchainTable",
        key: [],
    },

    PhantomleechSkill: {
        schema: {
            casterId: "bytes32",
            unit1: "bytes32",
            unit2: "bytes32",
            unit3: "bytes32",
            unit4: "bytes32",
        },
        type: "offchainTable",
        key: [],
    },

    //item events ==================================================================================
    EnergizingEspressoUsed: {
        schema: {
            unitId: "bytes32",
        },
        type: "offchainTable",
        key: [],
    },

    PlayerReceivedItem: {
        schema: {
            player: "address",
            item: "ItemType",
        },
        type: "offchainTable",
        key: [],
    },

    ResurectionRaisinUsed: {
        schema: {
            unitId: "bytes32",
        },
        type: "offchainTable",
        key: [],
    },

    ApocalypticAppleUsed: {
        schema: {
            ownerId: "bytes32",
            yCoordintate: "uint32",
        },
        type: "offchainTable",
        key: [],
    },

    GrenadeThrown: {
        schema: {
            itemOwner: "bytes32",
            targetX: "uint32",
            targetY: "uint32",
        },
        type: "offchainTable",
        key: [],
    },

    OneBlastBerryUsed: {
        schema: {
            itemOwner: "bytes32",
        },
        type: "offchainTable",
        key: [],
    },

    ChaosChocolateUsed: {
        schema: {
            ownerId: "bytes32",
            lane: "uint32",
        },
        type: "offchainTable",
        key: []
    },

    InvincibleIcingUsed: {
        schema: {
            ownerId: "bytes32",
            target: "bytes32", // always 0 if isTierIV is true
            lane: "uint32", // 0 by default, 
            isTierIV: "bool",
        },
        type: "offchainTable",
        key: [] //FIXME removing ownerId from here should resolve issue #224
    },

    //TODO adjust SouffleSurge offchain event and add proper calling in exec functions
    SouffleSurgeUsed: {
        schema: {
            ownerId: "bytes32",
            targets: "bytes32[]",
        },
        type: "offchainTable",
        key: []
    },

    QuantumQuicheUsed: {
        schema: {
            ownerId: "bytes32",
            target: "bytes32",
            lane: "uint32",
            isTierIV: "bool",
        },
        type: "offchainTable",
        key: []
    },

    StomachBittersUsed: {
        schema: {
            ownerId: "bytes32",
        },
        type: "offchainTable",
        key: []
    },

    TabulaRiceUsed: {
        schema: {
            ownerId: "bytes32",
            previousType: "UnitType",
            newType: "UnitType",
        },
        type: "offchainTable",
        key: []
    },

    //lootbox events ==================================================================================

    LootboxOpened: {
        schema: {
            player: "address",
            item0: "uint32",
            item1: "uint32",
            item2: "uint32",
            item3: "uint32",
        },
        type: "offchainTable",
        key: ["player"],
    },

    //reforger event

    ReforgerUsed: {
        schema: {
            player: "address",
            item: "uint32",
            isSuccess: "bool",
        },
        type: "offchainTable",
        key: [],
    }
}
export default tables;
