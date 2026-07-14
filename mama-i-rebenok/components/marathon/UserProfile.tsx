import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useMarathon } from "@/contexts/MarathonContext";

const M = {
  primary: "#F59E0B",
  bg: "#FFFBF0",
  card: "#FFFFFF",
  border: "#FDE68A",
  muted: "#92400E",
  mutedLight: "#D97706",
  text: "#1C1917",
  secondary: "#FEF9EC",
};

export default function UserProfile() {
  const { currentUser, tasks, logout } = useMarathon();
  if (!currentUser) return null;

  const { phone, points, completions } = currentUser;
  const totalTasks = tasks.length;
  const doneTasks = completions.length;
  const progress = totalTasks > 0 ? doneTasks / totalTasks : 0;

  const getLevel = (pts: number) => {
    if (pts >= 300) return { label: "Герой добра", emoji: "🏆", next: null };
    if (pts >= 150) return { label: "Доброволец", emoji: "🥇", next: 300 };
    if (pts >= 50) return { label: "Помощник", emoji: "🥈", next: 150 };
    return { label: "Новичок", emoji: "🌱", next: 50 };
  };

  const level = getLevel(points);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: M.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={[styles.avatar, { backgroundColor: M.primary + "20", borderColor: M.primary }]}>
          <Text style={styles.avatarEmoji}>{level.emoji}</Text>
        </View>
        <Text style={[styles.phone, { color: M.text }]}>{phone}</Text>
        <Text style={[styles.levelLabel, { color: M.primary }]}>{level.label}</Text>
      </View>

      {/* Points card */}
      <View style={[styles.pointsCard, { backgroundColor: M.primary }]}>
        <Text style={styles.pointsMain}>{points}</Text>
        <Text style={styles.pointsSub}>баллов накоплено</Text>
        {level.next && (
          <View style={styles.progressWrap}>
            <View style={[styles.progressBg, { backgroundColor: "rgba(255,255,255,0.3)" }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(100, (points / level.next) * 100)}%`, backgroundColor: "#fff" },
                ]}
              />
            </View>
            <Text style={styles.progressLabel}>
              До следующего уровня: {level.next - points} баллов
            </Text>
          </View>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: M.card, borderColor: M.border }]}>
          <Text style={[styles.statNum, { color: M.primary }]}>{doneTasks}</Text>
          <Text style={[styles.statLbl, { color: M.muted }]}>заданий выполнено</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: M.card, borderColor: M.border }]}>
          <Text style={[styles.statNum, { color: M.primary }]}>{totalTasks - doneTasks}</Text>
          <Text style={[styles.statLbl, { color: M.muted }]}>осталось</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={[styles.progressCard, { backgroundColor: M.card, borderColor: M.border }]}>
        <View style={styles.progressCardHeader}>
          <Text style={[styles.progressCardTitle, { color: M.text }]}>Прогресс марафона</Text>
          <Text style={[styles.progressPct, { color: M.primary }]}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
        <View style={[styles.bigProgressBg, { backgroundColor: M.border }]}>
          <View
            style={[
              styles.bigProgressFill,
              { width: `${progress * 100}%`, backgroundColor: M.primary },
            ]}
          />
        </View>
        <Text style={[styles.progressSub, { color: M.mutedLight }]}>
          {doneTasks} из {totalTasks} заданий
        </Text>
      </View>

      {/* Completed tasks */}
      {completions.length > 0 && (
        <View style={[styles.historyCard, { backgroundColor: M.card, borderColor: M.border }]}>
          <Text style={[styles.historyTitle, { color: M.text }]}>Выполненные задания</Text>
          {completions.map((c) => {
            const task = tasks.find((t) => t.id === c.taskId);
            return (
              <View key={c.id} style={[styles.historyItem, { borderTopColor: M.border }]}>
                <Feather name="check-circle" size={14} color="#22C55E" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.historyTask, { color: M.text }]}>
                    {task?.title ?? "Задание"}
                  </Text>
                  <Text style={[styles.historyDate, { color: M.mutedLight }]}>
                    {new Date(c.completedAt).toLocaleDateString("ru-RU")}
                  </Text>
                </View>
                {c.photoUri && (
                  <Image source={{ uri: c.photoUri }} style={styles.historyPhoto} />
                )}
                <Text style={[styles.historyPoints, { color: M.primary }]}>
                  +{task?.points ?? 0} ⭐
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Logout */}
      <TouchableOpacity
        style={[styles.logoutBtn, { borderColor: "#FCA5A5", backgroundColor: "#FFF1F1" }]}
        onPress={logout}
        activeOpacity={0.8}
      >
        <Feather name="log-out" size={16} color="#EF4444" />
        <Text style={[styles.logoutText, { color: "#EF4444" }]}>Выйти из профиля</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  avatarSection: { alignItems: "center", gap: 6, paddingVertical: 8 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: { fontSize: 36 },
  phone: { fontSize: 17, fontFamily: "Inter_600SemiBold", marginTop: 4 },
  levelLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  pointsCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    gap: 4,
  },
  pointsMain: { fontSize: 52, fontFamily: "Inter_700Bold", color: "#fff" },
  pointsSub: { fontSize: 15, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.85)" },
  progressWrap: { width: "100%", gap: 6, marginTop: 10 },
  progressBg: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: 8, borderRadius: 4 },
  progressLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  statsRow: { flexDirection: "row", gap: 12 },
  statBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    gap: 4,
  },
  statNum: { fontSize: 28, fontFamily: "Inter_700Bold" },
  statLbl: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center" },
  progressCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  progressCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  progressCardTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  progressPct: { fontSize: 16, fontFamily: "Inter_700Bold" },
  bigProgressBg: { height: 10, borderRadius: 5, overflow: "hidden" },
  bigProgressFill: { height: 10, borderRadius: 5 },
  progressSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  historyCard: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 0 },
  historyTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginBottom: 10 },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  historyTask: { fontSize: 13, fontFamily: "Inter_500Medium", lineHeight: 18 },
  historyDate: { fontSize: 11, fontFamily: "Inter_400Regular" },
  historyPhoto: { width: 36, height: 36, borderRadius: 8 },
  historyPoints: { fontSize: 13, fontFamily: "Inter_700Bold" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
  },
  logoutText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
