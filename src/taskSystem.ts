// ========================================
// Task System - Daily, Achievement, Challenge
// ========================================

import {
  getState,
  setTaskProgress,
  claimTaskReward,
  addItem,
  setAchievementProgress,
  claimAchievementReward,
  addExp,
  addCoins,
} from './gameState';

export interface TaskDef {
  id: string;
  name: string;
  emoji: string;
  description: string;
  type: 'click' | 'quiz' | 'memory' | 'checkin' | 'auto';
  targetCount: number;
  rewards: { itemId: string; count: number }[];
  expReward: number;
}

export interface AchievementDef {
  id: string;
  name: string;
  emoji: string;
  description: string;
  statKey: string;
  targetValue: number;
  rewards: { itemId: string; count: number }[];
  expReward: number;
}

// Generate daily tasks
export function generateDailyTasks(): TaskDef[] {
  return [
    {
      id: 'daily_checkin',
      name: '每日签到',
      emoji: '📝',
      description: '今天也要来看看宠物哦！',
      type: 'checkin',
      targetCount: 1,
      rewards: [
        { itemId: 'bread', count: 2 },
        { itemId: 'ball', count: 1 },
        { itemId: 'soap', count: 1 },
      ],
      expReward: 15,
    },
    {
      id: 'daily_click',
      name: '连续点击挑战',
      emoji: '👆',
      description: '10秒内尽可能多地点击！达到30次过关',
      type: 'click',
      targetCount: 30,
      rewards: [
        { itemId: 'meat', count: 1 },
        { itemId: 'exp_sm', count: 1 },
      ],
      expReward: 25,
    },
    {
      id: 'daily_quiz',
      name: '宠物知识问答',
      emoji: '❓',
      description: '回答3道关于动物的趣味问题',
      type: 'quiz',
      targetCount: 3,
      rewards: [
        { itemId: 'teddy', count: 1 },
        { itemId: 'shampoo', count: 1 },
      ],
      expReward: 30,
    },
    {
      id: 'daily_memory',
      name: '记忆翻牌',
      emoji: '🃏',
      description: '找出所有配对的卡片',
      type: 'memory',
      targetCount: 6,
      rewards: [
        { itemId: 'cake', count: 1 },
        { itemId: 'exp_md', count: 1 },
      ],
      expReward: 40,
    },
    {
      id: 'daily_feed',
      name: '喂养宠物',
      emoji: '🍖',
      description: '使用任意食物喂养宠物3次',
      type: 'auto',
      targetCount: 3,
      rewards: [{ itemId: 'exp_sm', count: 2 }],
      expReward: 20,
    },
    {
      id: 'daily_play',
      name: '陪伴玩耍',
      emoji: '🎾',
      description: '使用任意玩具与宠物玩耍2次',
      type: 'auto',
      targetCount: 2,
      rewards: [{ itemId: 'sparkle', count: 1 }],
      expReward: 20,
    },
  ];
}

// Achievement definitions
export function getAchievements(): AchievementDef[] {
  return [
    {
      id: 'ach_tasks_10',
      name: '勤劳小蜜蜂',
      emoji: '🐝',
      description: '累计完成10个任务',
      statKey: 'totalTasksCompleted',
      targetValue: 10,
      rewards: [{ itemId: 'exp_md', count: 2 }],
      expReward: 50,
    },
    {
      id: 'ach_tasks_50',
      name: '任务大师',
      emoji: '🏅',
      description: '累计完成50个任务',
      statKey: 'totalTasksCompleted',
      targetValue: 50,
      rewards: [{ itemId: 'exp_lg', count: 1 }],
      expReward: 100,
    },
    {
      id: 'ach_tasks_100',
      name: '传说任务者',
      emoji: '🏆',
      description: '累计完成100个任务',
      statKey: 'totalTasksCompleted',
      targetValue: 100,
      rewards: [
        { itemId: 'exp_lg', count: 3 },
        { itemId: 'gamepad', count: 1 },
      ],
      expReward: 200,
    },
    {
      id: 'ach_items_20',
      name: '细心照料者',
      emoji: '💝',
      description: '累计使用20个道具',
      statKey: 'totalItemsUsed',
      targetValue: 20,
      rewards: [
        { itemId: 'gamepad', count: 1 },
        { itemId: 'cake', count: 2 },
      ],
      expReward: 60,
    },
    {
      id: 'ach_items_100',
      name: '道具专家',
      emoji: '🎁',
      description: '累计使用100个道具',
      statKey: 'totalItemsUsed',
      targetValue: 100,
      rewards: [{ itemId: 'exp_lg', count: 2 }],
      expReward: 150,
    },
    {
      id: 'ach_clicks_500',
      name: '点击狂魔',
      emoji: '🖱️',
      description: '累计点击500次',
      statKey: 'totalClicks',
      targetValue: 500,
      rewards: [{ itemId: 'exp_md', count: 3 }],
      expReward: 80,
    },
    {
      id: 'ach_level_10',
      name: '初出茅庐',
      emoji: '🌱',
      description: '宠物达到10级',
      statKey: 'highestLevel',
      targetValue: 10,
      rewards: [{ itemId: 'exp_md', count: 2 }],
      expReward: 50,
    },
    {
      id: 'ach_level_30',
      name: '崭露头角',
      emoji: '⚡',
      description: '宠物达到30级',
      statKey: 'highestLevel',
      targetValue: 30,
      rewards: [{ itemId: 'exp_lg', count: 1 }],
      expReward: 100,
    },
    {
      id: 'ach_level_50',
      name: '实力强者',
      emoji: '🔥',
      description: '宠物达到50级',
      statKey: 'highestLevel',
      targetValue: 50,
      rewards: [{ itemId: 'exp_lg', count: 2 }],
      expReward: 150,
    },
    {
      id: 'ach_level_80',
      name: '传奇存在',
      emoji: '🌟',
      description: '宠物达到80级',
      statKey: 'highestLevel',
      targetValue: 80,
      rewards: [{ itemId: 'exp_lg', count: 3 }],
      expReward: 250,
    },
    {
      id: 'ach_level_100',
      name: '神话巅峰',
      emoji: '🌌',
      description: '宠物达到100级',
      statKey: 'highestLevel',
      targetValue: 100,
      rewards: [{ itemId: 'exp_lg', count: 5 }],
      expReward: 500,
    },
    {
      id: 'ach_evo_3',
      name: '三次进化',
      emoji: '🦋',
      description: '累计进化3次',
      statKey: 'evolutionCount',
      targetValue: 3,
      rewards: [{ itemId: 'exp_md', count: 3 }],
      expReward: 80,
    },
    {
      id: 'ach_evo_7',
      name: '七度蜕变',
      emoji: '🔮',
      description: '累计进化7次',
      statKey: 'evolutionCount',
      targetValue: 7,
      rewards: [{ itemId: 'exp_lg', count: 2 }],
      expReward: 200,
    },
  ];
}

// Claim task and give rewards
export function claimDailyTaskReward(taskDef: TaskDef): boolean {
  const claimed = claimTaskReward(taskDef.id);
  if (!claimed) return false;

  // Give rewards
  for (const reward of taskDef.rewards) {
    addItem(reward.itemId, reward.count);
  }
  // Award coins: basic tasks 20, harder ones 50
  const coinReward = taskDef.type === 'auto' ? 20 : 50;
  addCoins(coinReward);

  if (taskDef.expReward > 0) {
    addExp(taskDef.expReward);
  }
  return true;
}

export function claimAchievementRewardFull(achDef: AchievementDef): boolean {
  const claimed = claimAchievementReward(achDef.id);
  if (!claimed) return false;

  for (const reward of achDef.rewards) {
    addItem(reward.itemId, reward.count);
  }
  // Achievement coins: based on target value
  addCoins(achDef.targetValue * 2);

  if (achDef.expReward > 0) {
    addExp(achDef.expReward);
  }
  return true;
}

// Track auto-tasks (feed, play)
export function trackAutoTask(taskId: string) {
  const state = getState();
  const tp = state.tasks.find((t: { taskId: string }) => t.taskId === taskId);
  const tasks = generateDailyTasks();
  const def = tasks.find((t) => t.id === taskId);
  if (!def) return;

  const current = tp ? tp.progress : 0;
  const newProgress = current + 1;
  setTaskProgress(taskId, newProgress, newProgress >= def.targetCount);
}

// Update achievements based on stats
export function updateAchievements() {
  const state = getState();
  const achs = getAchievements();
  for (const ach of achs) {
    const val = (state.stats as Record<string, number>)[ach.statKey] || 0;
    const completed = val >= ach.targetValue;
    setAchievementProgress(ach.id, Math.min(val, ach.targetValue), completed);
  }
}

// Quiz questions pool
export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export const QUIZ_POOL: QuizQuestion[] = [
  {
    question: '猫每天平均睡多少个小时？',
    options: ['8小时', '12-16小时', '6小时', '20小时'],
    correctIndex: 1,
  },
  {
    question: '狗的嗅觉比人类灵敏多少倍？',
    options: ['10倍', '100倍', '1万倍', '100万倍'],
    correctIndex: 2,
  },
  {
    question: '兔子的牙齿会一直生长吗？',
    options: ['会', '不会', '只长到1岁', '只有门牙会'],
    correctIndex: 0,
  },
  {
    question: '仓鼠的腮帮子可以装多少食物？',
    options: ['几颗', '体重的一半', '跟头一样大', '装不了多少'],
    correctIndex: 1,
  },
  { question: '狐狸属于什么科？', options: ['猫科', '犬科', '熊科', '鼬科'], correctIndex: 1 },
  {
    question: '独角兽在神话中象征什么？',
    options: ['力量', '纯洁', '财富', '速度'],
    correctIndex: 1,
  },
  {
    question: '猫为什么会发出呼噜声？',
    options: ['生气了', '饿了', '满足或自我安慰', '在说话'],
    correctIndex: 2,
  },
  {
    question: '世界上最小的狗品种是？',
    options: ['吉娃娃', '博美', '约克夏', '马尔济斯'],
    correctIndex: 0,
  },
  {
    question: '兔子的眼睛能看到多少度的视野？',
    options: ['180度', '270度', '360度', '90度'],
    correctIndex: 2,
  },
  { question: '仓鼠的寿命大约是？', options: ['1年', '2-3年', '5年', '10年'], correctIndex: 1 },
  {
    question: '狐狸一般在什么时候活动？',
    options: ['白天', '夜晚', '黄昏和黎明', '中午'],
    correctIndex: 2,
  },
  {
    question: '猫有几个脚趾？',
    options: ['前4后4', '前5后4', '前5后5', '前4后5'],
    correctIndex: 1,
  },
  {
    question: '下列哪种动物被称为“沙漠之舟”？',
    options: ['马', '骆驼', '驴', '鸵鸟'],
    correctIndex: 1,
  },
  {
    question: '企鹅生活在地球的哪个极点？',
    options: ['北极', '南极', '两个都有', '赤道'],
    correctIndex: 1,
  },
  { question: '哪种鸟类可以倒着飞？', options: ['老鹰', '蜂鸟', '燕子', '乌鸦'], correctIndex: 1 },
  { question: '大象用什么来出汗？', options: ['皮肤', '鼻子', '耳朵', '舌头'], correctIndex: 2 },
];

export function getRandomQuizQuestions(count: number): QuizQuestion[] {
  const shuffled = [...QUIZ_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
