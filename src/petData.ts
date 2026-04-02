// ========================================
// Pet Data - Species, Evolution, Items
// ========================================

export interface CombatStats {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  atk: number;
  def: number;
  spd: number;
}

export interface SkillDef {
  id: string;
  name: string;
  description: string;
  mpCost: number;
  multiplier: number; // Damage multiplier
  effect?: 'stun' | 'heal' | 'buff_atk' | 'none';
}

export interface EvolutionStage {
  level: number;
  name: string;
  emoji: string;
  image?: string; // High-quality asset path
  description: string;
  baseStats?: {
    hp: number;
    atk: number;
    def: number;
    spd: number;
  };
}

export interface EnvironmentTheme {
  background: string; // CSS gradient or image
  themeColor: string;
  facilities: {
    food: string; // emoji
    toy: string; // emoji
    wash: string; // emoji
  };
  props: string[]; // Static decorations (emojis)
  particleType: 'firefly' | 'leaf' | 'snow' | 'none';
}

export interface PetSpecies {
  id: string;
  name: string;
  eggEmoji: string;
  eggColor: string;
  eggGlow: string;
  hint: string;
  description: string;
  skill: SkillDef;
  stages: EvolutionStage[];
  environment: EnvironmentTheme;
}

export interface ItemDef {
  id: string;
  name: string;
  emoji: string;
  type: 'food' | 'toy' | 'soap' | 'potion';
  stat: 'hunger' | 'happy' | 'clean' | 'exp';
  value: number;
  description: string;
  price: number; // Cost in Star Coins
}

// 6 Pet Species with 10 evolution stages each
export const PET_SPECIES: PetSpecies[] = [
  {
    id: 'cat',
    name: '猫咪',
    eggEmoji: '🥚',
    eggColor: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    eggGlow: 'rgba(251, 191, 36, 0.4)',
    hint: '温暖的气息...似乎有什么在轻轻呼噜...',
    description: '从娇弱的小猫，最终进化为掌控星辰的万界之灵。',
    skill: {
      id: 'slash',
      name: '致命利爪',
      description: '聚集力量挥出利爪，造成大量物理伤害',
      mpCost: 20,
      multiplier: 2.2,
    },
    stages: [
      { level: 0, name: '神秘蛋', emoji: '🥚', description: '一颗温暖的金色蛋' },
      {
        level: 1,
        name: '新生小毛球',
        emoji: '🐱',
        image: '/assets/pets/cat_lv1.png',
        description: '刚破壳的娇弱生命',
        baseStats: { hp: 50, atk: 12, def: 8, spd: 15 },
      },
      {
        level: 2,
        name: '好奇奶猫',
        emoji: '😸',
        image: '/assets/pets/cat_lv2_galaxy_kitten_1773531085871.png',
        description: '对世界充满了无限好奇',
        baseStats: { hp: 80, atk: 20, def: 12, spd: 25 },
      },
      {
        level: 5,
        name: '灵动幼猫',
        emoji: '🐈',
        image: '/assets/pets/cat_lv5_nebula_cat_1773531099369.png',
        description: '步履轻盈，开始学习捕猎',
        baseStats: { hp: 150, atk: 45, def: 25, spd: 50 },
      },
      {
        level: 10,
        name: '影迹黑猫',
        emoji: '🐈‍⬛',
        image: '/assets/pets/cat_lv10_starlight_leopard_1773531112921.png',
        description: '融合在阴影中的优雅杀手',
        baseStats: { hp: 300, atk: 90, def: 50, spd: 110 },
      },
      {
        level: 18,
        name: '丛林山猫',
        emoji: '🐆',
        image: '/assets/pets/cat_lv18_cosmic_guardian_1773531125112.png',
        description: '野性初现，体型愈发健壮',
        baseStats: { hp: 600, atk: 180, def: 100, spd: 220 },
      },
      {
        level: 30,
        name: '烈焰猛虎',
        emoji: '🐅',
        image: '/assets/pets/cat_lv30_flame_tiger_warrior_style_1773563822083.png',
        description: '百兽之王的气息开始觉醒',
        baseStats: { hp: 1200, atk: 380, def: 200, spd: 450 },
      },
      {
        level: 50,
        name: '赤金狮王',
        emoji: '🦁',
        image: '/assets/pets/cat_lv50_golden_regal_lion_king_concept_1773564011507.png',
        description: '统领群雄，霸气无可匹敌',
        baseStats: { hp: 2500, atk: 850, def: 450, spd: 900 },
      },
      {
        level: 70,
        name: '圣域守卫',
        emoji: '🛡️',
        image: '/assets/pets/cat_lv70_sanctuary_guardian_armored_lion_1773563898016.png',
        description: '古老神殿的永恒守护者',
        baseStats: { hp: 5000, atk: 1800, def: 1200, spd: 1600 },
      },
      {
        level: 85,
        name: '星辰之主',
        emoji: '🌟',
        image: '/assets/pets/cat_lv85_star_lord_nebula_leopard_cat_1773563912328.png',
        description: '踏星空而行，目如璀璨恒星',
        baseStats: { hp: 8000, atk: 3200, def: 2200, spd: 2800 },
      },
      {
        level: 100,
        name: '万界之灵',
        emoji: '🌌',
        image: '/assets/pets/cat_lv100.png',
        description: '超越位面的永恒存在',
        baseStats: { hp: 15000, atk: 6500, def: 4500, spd: 6000 },
      },
    ],
    environment: {
      background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)',
      themeColor: '#8b5cf6',
      facilities: { food: '🥣', toy: '🧶', wash: '🛁' },
      props: ['🪑', '🕯️', '📚', '📦'],
      particleType: 'firefly',
    },
  },
  {
    id: 'dog',
    name: '小狗',
    eggEmoji: '🥚',
    eggColor: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
    eggGlow: 'rgba(96, 165, 250, 0.4)',
    hint: '忠诚的能量在涌动...仿佛听到了小小的吠声...',
    description: '通过不懈努力，忠诚的小狗将蜕变为守护宇宙的狼神。',
    skill: {
      id: 'howl',
      name: '勇气咆哮',
      description: '发出的咆哮鼓舞自身，造成伤害并带有震慑力',
      mpCost: 15,
      multiplier: 1.8,
      effect: 'stun',
    },
    stages: [
      { level: 0, name: '神秘蛋', emoji: '🥚', description: '一颗跳动的蓝色蛋' },
      {
        level: 1,
        name: '软萌新生',
        emoji: '🐶',
        image: '/assets/pets/dog_lv1.png',
        description: '只会发出微弱的嘤嘤声',
        baseStats: { hp: 65, atk: 10, def: 12, spd: 10 },
      },
      {
        level: 2,
        name: '活泼奶狗',
        emoji: '🐕',
        image: '/assets/pets/dog_lv2_bright_pup_1773531221044.png',
        description: '兴奋地摇晃着短小的尾巴',
        baseStats: { hp: 100, atk: 18, def: 18, spd: 18 },
      },
      {
        level: 5,
        name: '机警幼犬',
        emoji: '🐕‍🦺',
        image: '/assets/pets/dog_lv5_swift_tracker_1773531233850.png',
        description: '掌握了多种技能的聪慧同伴',
        baseStats: { hp: 200, atk: 40, def: 40, spd: 35 },
      },
      {
        level: 10,
        name: '狂风铁犬',
        emoji: '🦮',
        image: '/assets/pets/dog_lv10_frost_wolf_1773531247694.png',
        description: '速度极快，意志如钢铁般坚定',
        baseStats: { hp: 400, atk: 85, def: 85, spd: 70 },
      },
      {
        level: 18,
        name: '寒原孤狼',
        emoji: '🐺',
        image: '/assets/pets/dog_lv18_star_wolf_deity_1773531261670.png',
        description: '在极寒之地磨砺出的野性',
        baseStats: { hp: 800, atk: 180, def: 160, spd: 140 },
      },
      {
        level: 40,
        name: '影之幽狼',
        emoji: '🐾',
        image: '/assets/pets/dog_lv40_shadow_ghost_wolf_stealth_mode_1773564027675.png',
        description: '在黑暗中穿梭的致命利牙',
        baseStats: { hp: 1800, atk: 450, def: 400, spd: 350 },
      },
      {
        level: 55,
        name: '雷霆巨狼',
        emoji: '⚡',
        image: '/assets/pets/dog_lv55_thunder_giant_wolf_electric_aura_1773564045768.png',
        description: '伴随着闪电而生的狂暴之力',
        baseStats: { hp: 3500, atk: 950, def: 800, spd: 700 },
      },
      {
        level: 70,
        name: '极光座狼',
        emoji: '💎',
        description: '身披极光之甲的王者',
        baseStats: { hp: 6000, atk: 1600, def: 1500, spd: 1200 },
      },
      {
        level: 85,
        name: '圣域战神',
        emoji: '🛡️',
        description: '守护神域的最强战力',
        baseStats: { hp: 10000, atk: 3000, def: 2800, spd: 2200 },
      },
      {
        level: 100,
        name: '永恒狼神',
        emoji: '🌠',
        image: '/assets/pets/dog_lv100.png',
        description: '化身星魂，永恒守护宇宙',
        baseStats: { hp: 20000, atk: 6000, def: 5500, spd: 4500 },
      },
    ],
    environment: {
      background: 'linear-gradient(180deg, #064e3b 0%, #065f46 100%)',
      themeColor: '#10b981',
      facilities: { food: '🥩', toy: '🎾', wash: '🚿' },
      props: ['🌳', '🌲', '🪵', '⛺'],
      particleType: 'leaf',
    },
  },
  {
    id: 'rabbit',
    name: '兔子',
    eggEmoji: '🥚',
    eggColor: 'linear-gradient(135deg, #f472b6, #ec4899)',
    eggGlow: 'rgba(244, 114, 182, 0.4)',
    hint: '柔软蓬松的气息...有什么在里面蹦跶...',
    description: '从草丛中的小兔，进化为广寒宫中的月华仙音。',
    skill: {
      id: 'moonbeam',
      name: '月华洗礼',
      description: '凝聚月之精华，对敌人造成伤害并小幅恢复自身',
      mpCost: 25,
      multiplier: 1.5,
      effect: 'heal',
    },
    stages: [
      { level: 0, name: '神秘蛋', emoji: '🥚', description: '一颗粉嫩的蛋' },
      {
        level: 1,
        name: '毛绒奶兔',
        emoji: '🐰',
        image: '/assets/pets/rabbit_lv1.png',
        description: '害羞地缩成一个小球',
        baseStats: { hp: 45, atk: 8, def: 8, spd: 22 },
      },
      {
        level: 2,
        name: '梦想兔',
        emoji: '🐇',
        image: '/assets/pets/rabbit_lv2_dream_bunny_1773531287454.png',
        description: '被温柔的花瓣包裹着的梦想',
        baseStats: { hp: 70, atk: 15, def: 12, spd: 35 },
      },
      {
        level: 5,
        name: '四叶神兔',
        emoji: '🍀',
        image: '/assets/pets/rabbit_lv5_clover_rabbit_1773531298748.png',
        description: '拥有四叶草的幸运守护',
        baseStats: { hp: 140, atk: 35, def: 28, spd: 70 },
      },
      {
        level: 10,
        name: '森林精灵',
        emoji: '🍃',
        image: '/assets/pets/rabbit_lv10_cherry_blossom_fairy_1773531313691.png',
        description: '穿梭于森林的绿意之中',
        baseStats: { hp: 280, atk: 80, def: 60, spd: 140 },
      },
      {
        level: 18,
        name: '樱花仙子',
        emoji: '🌸',
        image: '/assets/pets/rabbit_lv18_moon_palace_jade_rabbit_1773531329365.png',
        description: '所到之处，繁花落英缤纷',
        baseStats: { hp: 550, atk: 170, def: 120, spd: 280 },
      },
      {
        level: 40,
        name: '极乐玉兔',
        emoji: '🎀',
        description: '优雅、尊贵、不可方物',
        baseStats: { hp: 1300, atk: 450, def: 350, spd: 650 },
      },
      {
        level: 55,
        name: '月影魅影',
        emoji: '🌙',
        description: '在月光下舞动的华丽身姿',
        baseStats: { hp: 2600, atk: 950, def: 750, spd: 1300 },
      },
      {
        level: 70,
        name: '璀璨钻兔',
        emoji: '💎',
        description: '身躯宛如最坚硬的宝石',
        baseStats: { hp: 4800, atk: 1800, def: 1500, spd: 2200 },
      },
      {
        level: 85,
        name: '广寒幻音',
        emoji: '🎼',
        description: '来自月宫的神圣乐章',
        baseStats: { hp: 8000, atk: 3200, def: 2800, spd: 3800 },
      },
      {
        level: 100,
        name: '神话圣兔',
        emoji: '🌕',
        image: '/assets/pets/rabbit_lv100.png',
        description: '永恒月魂，万界生机的化身',
        baseStats: { hp: 16000, atk: 6000, def: 5000, spd: 7500 },
      },
    ],
    environment: {
      background: 'linear-gradient(180deg, #701a75 0%, #86198f 100%)',
      themeColor: '#d946ef',
      facilities: { food: '🥕', toy: '🎡', wash: '🌊' },
      props: ['🌸', '🎋', '⛩️', '🏮'],
      particleType: 'leaf',
    },
  },
  {
    id: 'hamster',
    name: '仓鼠',
    eggEmoji: '🥚',
    eggColor: 'linear-gradient(135deg, #fdba74, #f97316)',
    eggGlow: 'rgba(249, 115, 22, 0.4)',
    hint: '圆滚滚的能量...好像有什么在里面囤积食物...',
    description: '最平凡的小仓鼠，也能通过不懈奔跑触及宇宙之巅。',
    skill: {
      id: 'spark',
      name: '闪电疾走',
      description: '通过摩擦积聚大量静电，发动极速冲击',
      mpCost: 10,
      multiplier: 1.6,
    },
    stages: [
      { level: 0, name: '神秘蛋', emoji: '🥚', description: '一颗圆润的橙色蛋' },
      {
        level: 1,
        name: '一团棉花',
        emoji: '🐹',
        image: '/assets/pets/hamster_lv1.png',
        description: '几乎感觉不到重量',
        baseStats: { hp: 40, atk: 6, def: 6, spd: 20 },
      },
      {
        level: 2,
        name: '好奇奶鼠',
        emoji: '🐹',
        image: '/assets/pets/hamster_lv2_snack_ball_1773531357197.png',
        description: '虽然个头小，但志向远大',
        baseStats: { hp: 60, atk: 12, def: 12, spd: 32 },
      },
      {
        level: 5,
        name: '囤粮大师',
        emoji: '🍪',
        image: '/assets/pets/hamster_lv5_snack_master_1773562343025.png',
        description: '腮帮子总是鼓得大大的',
        baseStats: { hp: 120, atk: 28, def: 28, spd: 60 },
      },
      {
        level: 10,
        name: '速走小弟',
        emoji: '🐿️',
        image: '/assets/pets/hamster_lv10_fast_runner_1773562613603.png',
        description: '能在复杂环境中自由穿梭',
        baseStats: { hp: 250, atk: 65, def: 65, spd: 130 },
      },
      {
        level: 18,
        name: '极速先锋',
        emoji: '💨',
        image: '/assets/pets/hamster_lv18_speed_pioneer_wind_elemental_1773562697708.png',
        description: '奔跑速度快到产生残影',
        baseStats: { hp: 500, atk: 140, def: 140, spd: 300 },
      },
      {
        level: 28,
        name: '金币守卫',
        emoji: '💰',
        image: '/assets/pets/hamster_lv28_gold_coin_guardian_vault_style_1773562775252.png',
        description: '热衷于收集各种发光的财宝',
        baseStats: { hp: 900, atk: 300, def: 300, spd: 550 },
      },
      {
        level: 40,
        name: '电磁仓鼠',
        emoji: '⚡',
        description: '奔向轮盘时能产生强大的电流',
        baseStats: { hp: 1600, atk: 550, def: 550, spd: 950 },
      },
      {
        level: 55,
        name: '苍穹之驱',
        emoji: '🚀',
        description: '渴望着冲向蓝天',
        baseStats: { hp: 3000, atk: 900, def: 900, spd: 1600 },
      },
      {
        level: 70,
        name: '星舰领航',
        emoji: '🛰️',
        description: '掌握了星际穿梭的技术',
        baseStats: { hp: 5500, atk: 1800, def: 1600, spd: 2800 },
      },
      {
        level: 85,
        name: '时空行者',
        emoji: '🌀',
        description: '在错位时空中自由穿行',
        baseStats: { hp: 9000, atk: 3500, def: 3200, spd: 4500 },
      },
      {
        level: 100,
        name: '宇宙主宰',
        emoji: '🪐',
        image: '/assets/pets/hamster_lv100.png',
        description: '以万千行星为食的终极之光',
        baseStats: { hp: 18000, atk: 7000, def: 6500, spd: 8500 },
      },
    ],
    environment: {
      background: 'linear-gradient(180deg, #7c2d12 0%, #92400e 100%)',
      themeColor: '#f97316',
      facilities: { food: '🌻', toy: '⚙️', wash: '🧴' },
      props: ['🌽', '🚜', '🏡', '🌾'],
      particleType: 'leaf',
    },
  },
  {
    id: 'fox',
    name: '狐狸',
    eggEmoji: '🥚',
    eggColor: 'linear-gradient(135deg, #c084fc, #a855f7)',
    eggGlow: 'rgba(168, 85, 247, 0.4)',
    hint: '灵动而神秘的气息...狡黠的光芒若隐若现...',
    description: '身藏九尾之力，这只小狐狸终将进阶为法则的主宰。',
    skill: {
      id: 'phantom',
      name: '虚幻之火',
      description: '释放深紫色的幻觉之火，造成高额属性伤害并强化自身',
      mpCost: 30,
      multiplier: 2.5,
      effect: 'buff_atk',
    },
    stages: [
      { level: 0, name: '神秘蛋', emoji: '🥚', description: '一颗神秘的紫色蛋' },
      {
        level: 1,
        name: '幼瞳之狐',
        emoji: '🦊',
        image: '/assets/pets/fox_lv1.png',
        description: '那对紫色眼眸充满了灵性',
        baseStats: { hp: 55, atk: 14, def: 6, spd: 18 },
      },
      {
        level: 2,
        name: '草木之狐',
        emoji: '🍂',
        image: '/assets/pets/fox_lv2_spirit_kit_1773531149764.png',
        description: '学会了借用草木气息隐匿',
        baseStats: { hp: 90, atk: 25, def: 12, spd: 30 },
      },
      {
        level: 5,
        name: '寒晶灵狐',
        emoji: '❄️',
        image: '/assets/pets/fox_lv5_flame_fox_1773531163896.png',
        description: '诞生于极寒之心的冷冽之狐',
        baseStats: { hp: 180, atk: 55, def: 25, spd: 65 },
      },
      {
        level: 10,
        name: '幻术师',
        emoji: '🔮',
        image: '/assets/pets/fox_lv10_illusion_vulpix_1773531177193.png',
        description: '开始掌握名为“虚幻”的能力',
        baseStats: { hp: 350, atk: 110, def: 50, spd: 125 },
      },
      {
        level: 18,
        name: '紫电神狐',
        emoji: '💜',
        image: '/assets/pets/fox_lv18_nine_tails_deity_fox_1773531189899.png',
        description: '身披紫色闪电，迅捷无比',
        baseStats: { hp: 700, atk: 220, def: 100, spd: 250 },
      },
      {
        level: 40,
        name: '业火魔狐',
        emoji: '🔥',
        description: '愤怒时能燃尽一切的红莲之火',
        baseStats: { hp: 1600, atk: 550, def: 250, spd: 600 },
      },
      {
        level: 55,
        name: '三尾灵狐',
        emoji: '💠',
        description: '力量开始产生质的变化',
        baseStats: { hp: 3200, atk: 1100, def: 550, spd: 1200 },
      },
      {
        level: 70,
        name: '九尾妖王',
        emoji: '🎇',
        description: '俯瞰万灵的狐族王者',
        baseStats: { hp: 6000, atk: 2200, def: 1100, spd: 2200 },
      },
      {
        level: 85,
        name: '天狐真身',
        emoji: '🌟',
        description: '法则的化身，神圣不可侵犯',
        baseStats: { hp: 10000, atk: 4000, def: 2200, spd: 4200 },
      },
      {
        level: 100,
        name: '秩序之神',
        emoji: '✨',
        image: '/assets/pets/fox_lv100.png',
        description: '重塑 world 规则的永恒神祇',
        baseStats: { hp: 22000, atk: 8500, def: 4500, spd: 9000 },
      },
    ],
    environment: {
      background: 'linear-gradient(180deg, #4c1d95 0%, #5b21b6 100%)',
      themeColor: '#a855f7',
      facilities: { food: '🍓', toy: '🔮', wash: '✨' },
      props: ['⛩️', '🗿', '🔮', '🏮'],
      particleType: 'firefly',
    },
  },
  {
    id: 'unicorn',
    name: '独角兽',
    eggEmoji: '🥚',
    eggColor: 'linear-gradient(135deg, #67e8f9, #06b6d4, #8b5cf6)',
    eggGlow: 'rgba(6, 182, 212, 0.4)',
    hint: '彩虹般的光芒在闪烁...圣洁的力量在脉动...',
    description: '纯洁而高贵的独角兽，是所有美好事物的终极守护者。',
    skill: {
      id: 'shining',
      name: '神圣闪光',
      description: '独角绽放出净化万物的强光，审判罪恶',
      mpCost: 40,
      multiplier: 3.0,
    },
    stages: [
      { level: 0, name: '神秘蛋', emoji: '🥚', description: '一颗彩虹色的蛋' },
      {
        level: 1,
        name: '纯洁马驹',
        emoji: '🐴',
        image: '/assets/pets/unicorn_lv1.png',
        description: '额头处有隐隐的凸起',
        baseStats: { hp: 75, atk: 10, def: 15, spd: 12 },
      },
      {
        level: 2,
        name: '初角萌驹',
        emoji: '🐴',
        description: '额头的凸起越来越明显',
        baseStats: { hp: 120, atk: 20, def: 25, spd: 20 },
      },
      {
        level: 5,
        name: '踏云雏马',
        emoji: '🐎',
        image: '/assets/pets/unicorn_lv5_cloud_walker_1773562243168.png',
        description: '四蹄生风，能踏云而舞',
        baseStats: { hp: 220, atk: 40, def: 45, spd: 35 },
      },
      {
        level: 10,
        name: '独角显露',
        emoji: '🦄',
        image: '/assets/pets/unicorn_lv10_horn_revealing_1773562397092.png',
        description: '神圣之角宣告了它的身份',
        baseStats: { hp: 450, atk: 90, def: 100, spd: 80 },
      },
      {
        level: 18,
        name: '梦幻马兽',
        emoji: '🎠',
        image: '/assets/pets/unicorn_lv18_dream_beast_1773562626444.png',
        description: '行走在梦境与现实的边缘',
        baseStats: { hp: 900, atk: 180, def: 220, spd: 160 },
      },
      {
        level: 28,
        name: '虹光战马',
        emoji: '🌈',
        image: '/assets/pets/unicorn_lv28_rainbow_war_horse_knight_style_1773562711808.png',
        description: '彩虹之力喷薄而出',
        baseStats: { hp: 1600, atk: 350, def: 400, spd: 320 },
      },
      {
        level: 40,
        name: '星辰骏马',
        emoji: '💫',
        image: '/assets/pets/unicorn_lv40_galaxy_steed_nebula_mane_1773562790960.png',
        description: '鬃毛中隐藏着整片星系',
        baseStats: { hp: 3000, atk: 700, def: 850, spd: 600 },
      },
      {
        level: 55,
        name: '不坠之翼',
        emoji: '🕊️',
        description: '生出足以遮天的纯白羽翼',
        baseStats: { hp: 5500, atk: 1400, def: 1600, spd: 1100 },
      },
      {
        level: 70,
        name: '天界领主',
        emoji: '👑',
        description: '主宰天界的圣洁统领',
        baseStats: { hp: 9000, atk: 2500, def: 2800, spd: 2000 },
      },
      {
        level: 85,
        name: '圣曜独角兽',
        emoji: '☀️',
        description: '如太阳般耀眼，驱散一切黑暗',
        baseStats: { hp: 15000, atk: 4500, def: 5200, spd: 3500 },
      },
      {
        level: 100,
        name: '万兽之祖',
        emoji: '💎',
        image: '/assets/pets/unicorn_lv100.png',
        description: '一切生命的起源与永恒终点',
        baseStats: { hp: 28000, atk: 8000, def: 9500, spd: 6500 },
      },
    ],
    environment: {
      background: 'linear-gradient(180deg, #164e63 0%, #0891b2 100%)',
      themeColor: '#06b6d4',
      facilities: { food: '🍎', toy: '✨', wash: '⛲' },
      props: ['⛲', '💎', '🌟', '🦄'],
      particleType: 'firefly',
    },
  },
];

// Items
export const ITEMS: ItemDef[] = [
  {
    id: 'bread',
    name: '面包',
    emoji: '🍞',
    type: 'food',
    stat: 'hunger',
    value: 15,
    price: 50,
    description: '普通的面包，恢复少量饥饿',
  },
  {
    id: 'meat',
    name: '烤肉',
    emoji: '🍖',
    type: 'food',
    stat: 'hunger',
    value: 30,
    price: 100,
    description: '美味的烤肉，恢复大量饥饿',
  },
  {
    id: 'cake',
    name: '蛋糕',
    emoji: '🎂',
    type: 'food',
    stat: 'hunger',
    value: 50,
    price: 200,
    description: '精致的蛋糕，恢复超多饥饿',
  },
  {
    id: 'ball',
    name: '皮球',
    emoji: '🎾',
    type: 'toy',
    stat: 'happy',
    value: 15,
    price: 50,
    description: '弹力皮球，增加少量快乐',
  },
  {
    id: 'teddy',
    name: '玩偶',
    emoji: '🧸',
    type: 'toy',
    stat: 'happy',
    value: 30,
    price: 100,
    description: '可爱的玩偶，增加大量快乐',
  },
  {
    id: 'gamepad',
    name: '游戏机',
    emoji: '🎮',
    type: 'toy',
    stat: 'happy',
    value: 50,
    price: 300,
    description: '有趣的游戏机，增加超多快乐',
  },
  {
    id: 'soap',
    name: '肥皂',
    emoji: '🧼',
    type: 'soap',
    stat: 'clean',
    value: 15,
    price: 50,
    description: '普通肥皂，恢复少量清洁',
  },
  {
    id: 'shampoo',
    name: '沐浴露',
    emoji: '🧴',
    type: 'soap',
    stat: 'clean',
    value: 30,
    price: 100,
    description: '香喷喷的沐浴露，恢复大量清洁',
  },
  {
    id: 'sparkle',
    name: '魔法泡泡',
    emoji: '✨',
    type: 'soap',
    stat: 'clean',
    value: 50,
    price: 250,
    description: '闪闪发光的魔法泡泡',
  },
  {
    id: 'exp_sm',
    name: '经验果',
    emoji: '🍎',
    type: 'potion',
    stat: 'exp',
    value: 20,
    price: 150,
    description: '小小的经验果实',
  },
  {
    id: 'exp_md',
    name: '经验药水',
    emoji: '🧪',
    type: 'potion',
    stat: 'exp',
    value: 50,
    price: 400,
    description: '浓缩的经验药水',
  },
  {
    id: 'exp_lg',
    name: '经验宝石',
    emoji: '💎',
    type: 'potion',
    stat: 'exp',
    value: 120,
    price: 1000,
    description: '珍贵的经验宝石',
  },
  {
    id: 'growth_pot',
    name: '成长灵药',
    emoji: '🍶',
    type: 'potion',
    stat: 'exp',
    value: 250,
    price: 2000,
    description: '蕴含强大生命力的灵药',
  },
  {
    id: 'energy_drk',
    name: '能量饮料',
    emoji: '🥤',
    type: 'toy',
    stat: 'happy',
    value: 40,
    price: 150,
    description: '瞬间充满活力！',
  },
];

/**
 * Calculates current combat stats based on species, level, and growth stage.
 */
export function calculateStats(species: PetSpecies, level: number): CombatStats {
  const stageIdx = getStageIndex(species, level);
  const currentStage = species.stages[stageIdx];
  const nextStage = stageIdx + 1 < species.stages.length ? species.stages[stageIdx + 1] : null;

  const base = currentStage.baseStats || { hp: 50, atk: 10, def: 10, spd: 10 };
  const baseMp = 50 + stageIdx * 20; // Basic MP scaling

  if (!nextStage || !nextStage.baseStats) {
    return { ...base, maxHp: base.hp, mp: baseMp, maxMp: baseMp };
  }

  // Smooth linear interpolation between stages
  const levelRange = nextStage.level - currentStage.level;
  const progress = levelRange > 0 ? (level - currentStage.level) / levelRange : 0;

  const interpolate = (start: number, end: number) => Math.floor(start + (end - start) * progress);

  return {
    hp: interpolate(base.hp, nextStage.baseStats.hp),
    maxHp: interpolate(base.hp, nextStage.baseStats.hp),
    mp: baseMp + level * 2, // Smooth MP growth
    maxMp: baseMp + level * 2,
    atk: interpolate(base.atk, nextStage.baseStats.atk),
    def: interpolate(base.def, nextStage.baseStats.def),
    spd: interpolate(base.spd, nextStage.baseStats.spd),
  };
}

// Level-up exp curve
export function getExpForLevel(level: number): number {
  if (level <= 5) return level * 20; // 20, 40, 60, 80, 100
  if (level <= 20) return level * 50;
  return level * 100;
}

// Get current evolution stage index based on level
export function getStageIndex(species: PetSpecies, level: number): number {
  for (let i = species.stages.length - 1; i >= 0; i--) {
    if (level >= species.stages[i].level) return i;
  }
  return 0;
}

/**
 * Returns the HTML for the pet's visual representation at a given stage index.
 * If the stage lacks a dedicated image, it falls back to the newborn image (Stage 1)
 * with CSS filter classes applied for visual growth.
 */
export function renderPetAvatar(species: PetSpecies, stageIdx: number): string {
  const stage = species.stages[stageIdx];

  // If it's the egg (Stage 0), return emoji
  if (stageIdx === 0) return stage.emoji;

  // Search for the most relevant image
  // 1. Current stage image
  if (stage.image) {
    return `<img src="${stage.image}" class="pet-avatar-img pet-avatar-stage-${stageIdx}" alt="${stage.name}">`;
  }

  // 2. Fallback to Stage 1 image (Newborn) with filters
  const newbornStage = species.stages[1];
  if (newbornStage && newbornStage.image) {
    return `<img src="${newbornStage.image}" class="pet-avatar-img pet-avatar-stage-${stageIdx}" alt="${stage.name}">`;
  }

  // Final fallback (should not happen with current data)
  return stage.emoji;
}

export function getStage(species: PetSpecies, level: number): EvolutionStage {
  return species.stages[getStageIndex(species, level)];
}

// Get mood emoji based on stats
export function getMoodEmoji(hunger: number, happy: number, clean: number): string {
  const avg = (hunger + happy + clean) / 3;
  if (avg >= 80) return '😄';
  if (avg >= 60) return '🙂';
  if (avg >= 40) return '😐';
  if (avg >= 20) return '😟';
  return '😢';
}
