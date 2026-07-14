import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Task, TaskCategory, Reward, useMarathon } from "@/contexts/MarathonContext";

const M = {
  primary: "#7C3AED",
  bg: "#F9F7FF",
  card: "#FFFFFF",
  border: "#DDD6FE",
  input: "#EDE9FE",
  muted: "#4C1D95",
  mutedLight: "#7C3AED",
  text: "#1C1917",
  secondary: "#F5F3FF",
};

const AMBER = "#F59E0B";

const CATEGORY_OPTIONS: { key: TaskCategory; label: string }[] = [
  { key: "child", label: "👶 Для детей" },
  { key: "parent", label: "👩 Для родителей" },
  { key: "family", label: "👨‍👩‍👧 Для семьи" },
];

const EMOJIS = ["🎨", "🧱", "🧸", "🎡", "📚", "🎮", "🎁", "🌟", "🏅", "🎪"];

function AddTaskModal({ onClose }: { onClose: () => void }) {
  const { addTask } = useMarathon();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState("20");
  const [category, setCategory] = useState<TaskCategory>("family");

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Введите название задания");
      return;
    }
    const pts = parseInt(points, 10);
    if (isNaN(pts) || pts < 1) {
      Alert.alert("Укажите количество баллов (число больше 0)");
      return;
    }
    addTask({ title: title.trim(), description: description.trim(), points: pts, category });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
  };

  return (
    <Modal transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <ScrollView
          style={[styles.modal, { backgroundColor: M.card }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: M.text }]}>Новое задание</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={22} color={M.muted} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.fieldLabel, { color: M.muted }]}>Название *</Text>
          <View style={[styles.inputWrapper, { borderColor: M.border, backgroundColor: M.input }]}>
            <TextInput
              style={[styles.input, { color: M.text }]}
              placeholder="Название задания"
              placeholderTextColor={M.mutedLight}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <Text style={[styles.fieldLabel, { color: M.muted }]}>Описание</Text>
          <View style={[styles.inputWrapper, styles.textAreaWrap, { borderColor: M.border, backgroundColor: M.input }]}>
            <TextInput
              style={[styles.input, styles.textArea, { color: M.text }]}
              placeholder="Подробное описание задания..."
              placeholderTextColor={M.mutedLight}
              multiline
              numberOfLines={3}
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />
          </View>

          <Text style={[styles.fieldLabel, { color: M.muted }]}>Баллы за выполнение</Text>
          <View style={[styles.inputWrapper, { borderColor: M.border, backgroundColor: M.input }]}>
            <Feather name="star" size={16} color={AMBER} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.input, { color: M.text }]}
              placeholder="20"
              placeholderTextColor={M.mutedLight}
              keyboardType="number-pad"
              value={points}
              onChangeText={setPoints}
            />
          </View>

          <Text style={[styles.fieldLabel, { color: M.muted }]}>Категория</Text>
          <View style={styles.categoryRow}>
            {CATEGORY_OPTIONS.map((c) => (
              <TouchableOpacity
                key={c.key}
                style={[
                  styles.categoryBtn,
                  category === c.key
                    ? { backgroundColor: M.primary, borderColor: M.primary }
                    : { backgroundColor: M.input, borderColor: M.border },
                ]}
                onPress={() => setCategory(c.key)}
              >
                <Text style={[styles.categoryBtnText, { color: category === c.key ? "#fff" : M.muted }]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: M.primary }]}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            <Feather name="plus" size={18} color="#fff" />
            <Text style={styles.saveBtnText}>Добавить задание</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

function AddRewardModal({ onClose }: { onClose: () => void }) {
  const { addReward } = useMarathon();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pointsCost, setPointsCost] = useState("50");
  const [donationAmount, setDonationAmount] = useState("150");
  const [available, setAvailable] = useState("5");
  const [emoji, setEmoji] = useState("🎁");

  const handleSave = () => {
    if (!title.trim()) { Alert.alert("Введите название награды"); return; }
    const pts = parseInt(pointsCost, 10);
    const don = parseInt(donationAmount, 10);
    const avail = parseInt(available, 10);
    if (isNaN(pts) || pts < 1 || isNaN(don) || don < 1 || isNaN(avail) || avail < 1) {
      Alert.alert("Проверьте числовые поля");
      return;
    }
    addReward({ title: title.trim(), description: description.trim(), pointsCost: pts, donationAmount: don, emoji, available: avail });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
  };

  return (
    <Modal transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <ScrollView
          style={[styles.modal, { backgroundColor: M.card }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: M.text }]}>Новая награда</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={22} color={M.muted} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.fieldLabel, { color: M.muted }]}>Эмодзи</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
            {EMOJIS.map((e) => (
              <TouchableOpacity
                key={e}
                style={[
                  styles.emojiBtn,
                  emoji === e && { backgroundColor: M.primary + "30", borderColor: M.primary },
                  emoji !== e && { borderColor: M.border, backgroundColor: M.input },
                ]}
                onPress={() => setEmoji(e)}
              >
                <Text style={styles.emojiBtnText}>{e}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.fieldLabel, { color: M.muted }]}>Название *</Text>
          <View style={[styles.inputWrapper, { borderColor: M.border, backgroundColor: M.input }]}>
            <TextInput
              style={[styles.input, { color: M.text }]}
              placeholder="Название награды"
              placeholderTextColor={M.mutedLight}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <Text style={[styles.fieldLabel, { color: M.muted }]}>Описание</Text>
          <View style={[styles.inputWrapper, styles.textAreaWrap, { borderColor: M.border, backgroundColor: M.input }]}>
            <TextInput
              style={[styles.input, styles.textArea, { color: M.text }]}
              placeholder="Описание награды..."
              placeholderTextColor={M.mutedLight}
              multiline
              numberOfLines={2}
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.numbersRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { color: M.muted }]}>Баллы</Text>
              <View style={[styles.inputWrapper, { borderColor: M.border, backgroundColor: M.input }]}>
                <Feather name="star" size={14} color={AMBER} style={{ marginRight: 6 }} />
                <TextInput
                  style={[styles.input, { color: M.text }]}
                  keyboardType="number-pad"
                  value={pointsCost}
                  onChangeText={setPointsCost}
                />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { color: M.muted }]}>Пожертвование (₽)</Text>
              <View style={[styles.inputWrapper, { borderColor: M.border, backgroundColor: M.input }]}>
                <TextInput
                  style={[styles.input, { color: M.text }]}
                  keyboardType="number-pad"
                  value={donationAmount}
                  onChangeText={setDonationAmount}
                />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { color: M.muted }]}>Количество</Text>
              <View style={[styles.inputWrapper, { borderColor: M.border, backgroundColor: M.input }]}>
                <TextInput
                  style={[styles.input, { color: M.text }]}
                  keyboardType="number-pad"
                  value={available}
                  onChangeText={setAvailable}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: M.primary }]}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            <Feather name="plus" size={18} color="#fff" />
            <Text style={styles.saveBtnText}>Добавить награду</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function AdminPanel() {
  const { tasks, rewards, removeTask, removeReward, logout } = useMarathon();
  const [tab, setTab] = useState<"tasks" | "rewards">("tasks");
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddReward, setShowAddReward] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: M.bg }]}>
      {/* Admin header */}
      <View style={[styles.adminHeader, { backgroundColor: M.primary }]}>
        <View>
          <Text style={styles.adminTitle}>Панель администратора</Text>
          <Text style={styles.adminSub}>Марафон добрых дел</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutIconBtn}>
          <Feather name="log-out" size={18} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={[styles.tabRow, { backgroundColor: M.card, borderBottomColor: M.border }]}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === "tasks" && { borderBottomColor: M.primary }]}
          onPress={() => setTab("tasks")}
        >
          <Feather name="list" size={16} color={tab === "tasks" ? M.primary : "#9CA3AF"} />
          <Text style={[styles.tabBtnText, { color: tab === "tasks" ? M.primary : "#9CA3AF" }]}>
            Задания ({tasks.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === "rewards" && { borderBottomColor: M.primary }]}
          onPress={() => setTab("rewards")}
        >
          <Feather name="gift" size={16} color={tab === "rewards" ? M.primary : "#9CA3AF"} />
          <Text style={[styles.tabBtnText, { color: tab === "rewards" ? M.primary : "#9CA3AF" }]}>
            Награды ({rewards.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {tab === "tasks" ? (
          <>
            {tasks.map((task) => (
              <View key={task.id} style={[styles.itemCard, { backgroundColor: M.card, borderColor: M.border }]}>
                <View style={styles.itemTop}>
                  <Text style={[styles.itemTitle, { color: M.text }]}>{task.title}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert("Удалить задание?", task.title, [
                        { text: "Отмена", style: "cancel" },
                        { text: "Удалить", style: "destructive", onPress: () => removeTask(task.id) },
                      ])
                    }
                  >
                    <Feather name="trash-2" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
                {task.description ? (
                  <Text style={[styles.itemDesc, { color: M.mutedLight }]}>{task.description}</Text>
                ) : null}
                <View style={styles.itemMeta}>
                  <View style={[styles.metaBadge, { backgroundColor: AMBER + "20" }]}>
                    <Text style={[styles.metaText, { color: AMBER }]}>{task.points} ⭐</Text>
                  </View>
                  <View style={[styles.metaBadge, { backgroundColor: M.input }]}>
                    <Text style={[styles.metaText, { color: M.muted }]}>{task.category}</Text>
                  </View>
                </View>
              </View>
            ))}
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: M.primary }]}
              onPress={() => setShowAddTask(true)}
            >
              <Feather name="plus" size={18} color="#fff" />
              <Text style={styles.addBtnText}>Добавить задание</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {rewards.map((reward) => (
              <View key={reward.id} style={[styles.itemCard, { backgroundColor: M.card, borderColor: M.border }]}>
                <View style={styles.itemTop}>
                  <View style={styles.rewardTitleRow}>
                    <Text style={styles.rewardEmoji}>{reward.emoji}</Text>
                    <Text style={[styles.itemTitle, { color: M.text }]}>{reward.title}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert("Удалить награду?", reward.title, [
                        { text: "Отмена", style: "cancel" },
                        { text: "Удалить", style: "destructive", onPress: () => removeReward(reward.id) },
                      ])
                    }
                  >
                    <Feather name="trash-2" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
                {reward.description ? (
                  <Text style={[styles.itemDesc, { color: M.mutedLight }]}>{reward.description}</Text>
                ) : null}
                <View style={styles.itemMeta}>
                  <View style={[styles.metaBadge, { backgroundColor: AMBER + "20" }]}>
                    <Text style={[styles.metaText, { color: AMBER }]}>{reward.pointsCost} ⭐</Text>
                  </View>
                  <View style={[styles.metaBadge, { backgroundColor: "#EEF2FF" }]}>
                    <Text style={[styles.metaText, { color: "#4F46E5" }]}>{reward.donationAmount} ₽</Text>
                  </View>
                  <View style={[styles.metaBadge, { backgroundColor: M.input }]}>
                    <Text style={[styles.metaText, { color: M.muted }]}>
                      Осталось: {reward.available}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: M.primary }]}
              onPress={() => setShowAddReward(true)}
            >
              <Feather name="plus" size={18} color="#fff" />
              <Text style={styles.addBtnText}>Добавить награду</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {showAddTask && <AddTaskModal onClose={() => setShowAddTask(false)} />}
      {showAddReward && <AddRewardModal onClose={() => setShowAddReward(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  adminHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  adminTitle: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
  adminSub: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.75)" },
  logoutIconBtn: { padding: 4 },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  list: { padding: 16, gap: 10, paddingBottom: 40 },
  itemCard: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 8 },
  itemTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  rewardTitleRow: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  rewardEmoji: { fontSize: 22 },
  itemTitle: { flex: 1, fontSize: 14, fontFamily: "Inter_600SemiBold", lineHeight: 20 },
  itemDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 16 },
  itemMeta: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  metaBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  metaText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
    marginTop: 4,
  },
  addBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modal: {
    maxHeight: "90%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  modalTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  fieldLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    minHeight: 48,
  },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular", paddingVertical: 12 },
  textAreaWrap: { alignItems: "flex-start", paddingVertical: 8 },
  textArea: { minHeight: 72, paddingTop: 4 },
  categoryRow: { flexDirection: "row", gap: 8, marginBottom: 14, flexWrap: "wrap" },
  categoryBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryBtnText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  numbersRow: { flexDirection: "row", gap: 10, marginBottom: 4 },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 15,
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  saveBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  emojiBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  emojiBtnText: { fontSize: 22 },
});
