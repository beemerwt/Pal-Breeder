import { PalNames, XPThresholds, PassiveSkills } from "./dictionary";
import pals from "./palstats";

export default class Pal {
    /**
     * Creates a Pal object from the savedata
     * @param {any} pal 
     */
    constructor(pal) {
        const name = PalNames.lookup(pal.CharacterID);
        const palStats = pals[name];

        this.name = name;
        this.id = palStats.id;
        this.variant = palStats.variant ?? false;
        this.gender = pal.Gender === "EPalGenderType::Male" ? "male" : "female";
        this.type = palStats.mainType;
        this.sub = palStats.subType;
        
        const totalExp = pal.Exp;
        this.level = XPThresholds.findIndex((v) => v > totalExp);
        if (this.level === -1)
            this.level = 50;

        const expToNextLevel = XPThresholds[this.level] - XPThresholds[this.level - 1];
        this.exp = totalExp - XPThresholds[this.level - 1];
        this.remainingExp = expToNextLevel - this.exp;

        this.health = pal.HP.Value / 1000;
        this.maxHealth = pal.MaxHP.Value / 1000;
        this.satiety = pal.FullStomach ?? 100;
        this.maxSatiety = pal.MaxFullStomach ?? 100;

        this.sanity = (pal.MP?.Value / 1000) ?? 100;

        // this is the condenser rank (stars)
        this.rank = pal.Rank ?? 1;

        // these are the statue ranks (+30% at 10)
        this.rankAttack = pal.Rank_Attack ?? 0;
        this.rankDefense = pal.Rank_Defence ?? 0;
        this.rankHp = pal.Rank_HP ?? 0;
        this.rankCraftSpeed = pal.Rank_CraftSpeed ?? 0;
        this.rankTotal = this.rankAttack + this.rankDefense + this.rankHp + this.rankCraftSpeed;

        // TODO: Figure out how these equate to the ingame stats
        this.meleeAttack = pal.Talent_Melee;
        this.rangedAttack = pal.Talent_Shot;
        this.attack = this.meleeAttack;
        this.defense = pal.Talent_Defense;
        this.workSpeed = pal.CraftSpeed; // TODO: Implement the passives

        const suits = pal.CraftSpeeds.Values;
        this.suitabilities = {
            kindling: suits[0].Rank,
            watering: suits[1].Rank,
            planting: suits[2].Rank,
            electric: suits[3].Rank,
            handiwork: suits[4].Rank,
            gathering: suits[5].Rank,
            logging: suits[6].Rank,
            mining: suits[7].Rank,
            medicine: suits[9].Rank,
            cooling: suits[10].Rank,
            transport: suits[11].Rank,
            farming: suits[12].Rank
        };

        // If they are a 4-star then their suitabilities go up by 1
        if (this.rank === 5) {
            Object.entries(this.suitabilities).forEach(([ suit, rank ]) => {
                if (rank > 0)
                    this.suitabilities[suit] += 1;
            })
        }

        this.passives = [];
        pal.PassiveSkillList?.forEach((passive, i) => 
            this.passives[i] = {
                id: passive,
                ...PassiveSkills[passive]
            }
        );
    }
}