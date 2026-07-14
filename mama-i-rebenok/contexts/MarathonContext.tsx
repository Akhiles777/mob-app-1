import React, { createContext, useContext, useState, ReactNode } from "react";

export type TaskCategory = "child" | "parent" | "family";

export interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  category: TaskCategory;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  donationAmount: number;
  emoji: string;
  available: number;
}

export interface Completion {
  id: string;
  taskId: string;
  photoUri?: string;
  completedAt: string;
}

export interface MarathonUser {
  phone: string;
  points: number;
  completions: Completion[];
}

interface MarathonState {
  tasks: Task[];
  rewards: Reward[];
  currentUser: MarathonUser | null;
  isAdmin: boolean;
  login: (phone: string) => void;
  loginAdmin: (password: string) => boolean;
  logout: () => void;
  completeTask: (taskId: string, photoUri?: string) => void;
  redeemReward: (rewardId: string) => boolean;
  addTask: (task: Omit<Task, "id">) => void;
  removeTask: (id: string) => void;
  addReward: (reward: Omit<Reward, "id">) => void;
  removeReward: (id: string) => void;
}

const ADMIN_PASSWORD = "марафон2024";

const INITIAL_TASKS: Task[] = [
  {
    id: "t1",
    title: "Прочитай книгу вместе с мамой",
    description: "Прочитайте вслух любую книгу не менее 20 минут. Сделайте фото за чтением.",
    points: 20,
    category: "family",
  },
  {
    id: "t2",
    title: "Убери свою комнату",
    description: "Наведи порядок в своей комнате: разложи вещи, пропылесось, вытри пыль.",
    points: 15,
    category: "child",
  },
  {
    id: "t3",
    title: "Приготовь завтрак для семьи",
    description: "Приготовь утренний завтрак вместе с ребёнком. Сфотографируйте готовое блюдо.",
    points: 25,
    category: "parent",
  },
  {
    id: "t4",
    title: "Нарисуй рисунок для центра",
    description: "Нарисуй картину на тему добра и помощи. Принеси рисунок в центр.",
    points: 30,
    category: "child",
  },
  {
    id: "t5",
    title: "Прогулка в парке",
    description: "Проведите не менее часа на свежем воздухе. Сфотографируйтесь на прогулке.",
    points: 20,
    category: "family",
  },
  {
    id: "t6",
    title: "Позвони бабушке или дедушке",
    description: "Поговорите по видеосвязи с пожилыми родственниками не менее 15 минут.",
    points: 15,
    category: "family",
  },
];

const INITIAL_REWARDS: Reward[] = [
  {
    id: "r1",
    title: "Книжка-раскраска",
    description: "Красочная раскраска с героями мультфильмов для вашего ребёнка",
    pointsCost: 50,
    donationAmount: 150,
    emoji: "🎨",
    available: 10,
  },
  {
    id: "r2",
    title: "Набор пластилина",
    description: "12 цветов, мягкий пластилин для творческих занятий",
    pointsCost: 80,
    donationAmount: 200,
    emoji: "🧱",
    available: 8,
  },
  {
    id: "r3",
    title: "Мягкая игрушка",
    description: "Мягкий плюшевый мишка или зайчик на выбор",
    pointsCost: 120,
    donationAmount: 350,
    emoji: "🧸",
    available: 5,
  },
  {
    id: "r4",
    title: "Экскурсия по городу",
    description: "Организованная экскурсия по достопримечательностям Артёмовского для всей семьи",
    pointsCost: 200,
    donationAmount: 500,
    emoji: "🎡",
    available: 3,
  },
];

const MarathonContext = createContext<MarathonState | null>(null);

let taskCounter = 100;
let rewardCounter = 100;
let completionCounter = 100;

export function MarathonProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [rewards, setRewards] = useState<Reward[]>(INITIAL_REWARDS);
  const [currentUser, setCurrentUser] = useState<MarathonUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = (phone: string) => {
    setIsAdmin(false);
    setCurrentUser({ phone, points: 0, completions: [] });
  };

  const loginAdmin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setCurrentUser(null);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
  };

  const completeTask = (taskId: string, photoUri?: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !currentUser) return;
    const alreadyDone = currentUser.completions.some((c) => c.taskId === taskId);
    if (alreadyDone) return;
    const completion: Completion = {
      id: String(completionCounter++),
      taskId,
      photoUri,
      completedAt: new Date().toISOString(),
    };
    setCurrentUser((u) =>
      u
        ? {
            ...u,
            points: u.points + task.points,
            completions: [...u.completions, completion],
          }
        : u
    );
  };

  const redeemReward = (rewardId: string): boolean => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward || !currentUser) return false;
    if (currentUser.points < reward.pointsCost) return false;
    if (reward.available <= 0) return false;
    setCurrentUser((u) => u ? { ...u, points: u.points - reward.pointsCost } : u);
    setRewards((rs) =>
      rs.map((r) => r.id === rewardId ? { ...r, available: r.available - 1 } : r)
    );
    return true;
  };

  const addTask = (task: Omit<Task, "id">) => {
    setTasks((ts) => [...ts, { ...task, id: `t${taskCounter++}` }]);
  };

  const removeTask = (id: string) => {
    setTasks((ts) => ts.filter((t) => t.id !== id));
  };

  const addReward = (reward: Omit<Reward, "id">) => {
    setRewards((rs) => [...rs, { ...reward, id: `r${rewardCounter++}` }]);
  };

  const removeReward = (id: string) => {
    setRewards((rs) => rs.filter((r) => r.id !== id));
  };

  return (
    <MarathonContext.Provider
      value={{
        tasks,
        rewards,
        currentUser,
        isAdmin,
        login,
        loginAdmin,
        logout,
        completeTask,
        redeemReward,
        addTask,
        removeTask,
        addReward,
        removeReward,
      }}
    >
      {children}
    </MarathonContext.Provider>
  );
}

export function useMarathon() {
  const ctx = useContext(MarathonContext);
  if (!ctx) throw new Error("useMarathon must be used inside MarathonProvider");
  return ctx;
}
