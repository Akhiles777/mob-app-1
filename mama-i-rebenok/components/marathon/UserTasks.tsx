import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { Task, TaskCategory, useMarathon } from "@/contexts/MarathonContext";

const M = {
  primary: "#F59E0B",
  bg: "#FFFBF0",
  card: "#FFFFFF",
  border: "#FDE68A",
  input: "#FEF3C7",
  muted: "#92400E",
  mutedLight: "#D97706",
  text: "#1C1917",
  secondary: "#FEF9EC",
};

const CATEGORY_META: Record<TaskCategory, { label: string; color: string; emoji: string }> = {
  child: { label: "Для детей", color: "#3B82F6", emoji: "👶" },
  parent: { label: "Для родителей", color: "#10B981", emoji: "👩" },
  family: { label: "Для семьи", color: "#F59E0B", emoji: "👨‍👩‍👧" },
};

const FILTERS: { key: TaskCategory | "all"; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "family", label: "Семья" },
  { key: "child", label: "Дети" },
  { key: "parent", label: "Родители" },
];

interface PhotoModalProps {
  task: Task;
  onClose: () => void;
  onComplete: (photoUri?: string) => void;
}

function PhotoModal({ task, onClose, onComplete }: PhotoModalProps) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Нет доступа", "Разрешите доступ к фото в настройках");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Нет доступа", "Разрешите доступ к камере в настройках");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  return (
    <Modal transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: M.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: M.text }]}>Прикрепить фотоотчёт</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={22} color={M.muted} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.modalTask, { color: M.mutedLight }]}>{task.title}</Text>

          {photoUri ? (
            <View style={styles.photoPreviewWrap}>
              <Image source={{ uri: photoUri }} style={styles.photoPreview} resizeMode="cover" />
              <TouchableOpacity
                style={[styles.changePhotoBtn, { backgroundColor: M.input, borderColor: M.border }]}
                onPress={pickPhoto}
              >
                <Feather name="refresh-cw" size={14} color={M.mutedLight} />
                <Text style={[styles.changePhotoText, { color: M.mutedLight }]}>Изменить фото</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoButtons}>
              <TouchableOpacity
                style={[styles.photoBtn, { backgroundColor: M.input, borderColor: M.border }]}
                onPress={takePhoto}
                activeOpacity={0.8}
              >
                <Feather name="camera" size={24} color={M.primary} />
                <Text style={[styles.photoBtnText, { color: M.text }]}>Сделать фото</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.photoBtn, { backgroundColor: M.input, borderColor: M.border }]}
                onPress={pickPhoto}
                activeOpacity={0.8}
              >
                <Feather name="image" size={24} color={M.primary} />
                <Text style={[styles.photoBtnText, { color: M.text }]}>Из галереи</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[styles.confirmBtn, { backgroundColor: M.primary }]}
            onPress={() => onComplete(photoUri ?? undefined)}
            activeOpacity={0.85}
          >
            <Feather name="check" size={18} color="#fff" />
            <Text style={styles.confirmBtnText}>
              {photoUri ? "Отметить выполненным" : "Без фото — всё равно выполнено"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function UserTasks() {
  const { tasks, currentUser, completeTask } = useMarathon();
  const [filter, setFilter] = useState<TaskCategory | "all">("all");
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.category === filter);
  const completedIds = new Set(currentUser?.completions.map((c) => c.taskId) ?? []);

  const handleComplete = (photoUri?: string) => {
    if (!activeTask) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeTask(activeTask.id, photoUri);
    setActiveTask(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: M.bg }]}>
      {/* Points banner */}
      <View style={[styles.pointsBanner, { backgroundColor: M.primary }]}>
        <Feather name="star" size={18} color="#fff" />
        <Text style={styles.pointsText}>
          Ваши баллы: <Text style={styles.pointsValue}>{currentUser?.points ?? 0}</Text>
        </Text>
      </View>

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterBtn,
              filter === f.key
                ? { backgroundColor: M.primary, borderColor: M.primary }
                : { backgroundColor: M.card, borderColor: M.border },
            ]}
            onPress={() => setFilter(f.key)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterBtnText,
                filter === f.key ? { color: "#fff" } : { color: M.muted },
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {filtered.map((task) => {
          const done = completedIds.has(task.id);
          const cat = CATEGORY_META[task.category];
          const completion = currentUser?.completions.find((c) => c.taskId === task.id);
          return (
            <View
              key={task.id}
              style={[
                styles.taskCard,
                { backgroundColor: done ? "#F0FDF4" : M.card, borderColor: done ? "#86EFAC" : M.border },
              ]}
            >
              <View style={styles.taskTop}>
                <View style={[styles.catBadge, { backgroundColor: cat.color + "18" }]}>
                  <Text style={styles.catEmoji}>{cat.emoji}</Text>
                  <Text style={[styles.catLabel, { color: cat.color }]}>{cat.label}</Text>
                </View>
                <View style={[styles.pointsBadge, { backgroundColor: done ? "#22C55E" : M.primary }]}>
                  <Text style={styles.pointsBadgeText}>+{task.points} ⭐</Text>
                </View>
              </View>

              <Text style={[styles.taskTitle, { color: done ? "#166534" : M.text }]}>{task.title}</Text>
              <Text style={[styles.taskDesc, { color: M.mutedLight }]}>{task.description}</Text>

              {done ? (
                <View style={styles.doneRow}>
                  <Feather name="check-circle" size={16} color="#22C55E" />
                  <Text style={[styles.doneText, { color: "#166534" }]}>Выполнено!</Text>
                  {completion?.photoUri && (
                    <Image source={{ uri: completion.photoUri }} style={styles.thumbPhoto} />
                  )}
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.doBtn, { backgroundColor: M.primary }]}
                  onPress={() => setActiveTask(task)}
                  activeOpacity={0.85}
                >
                  <Feather name="check" size={15} color="#fff" />
                  <Text style={styles.doBtnText}>Отметить выполненным</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
        {filtered.length === 0 && (
          <Text style={[styles.empty, { color: M.mutedLight }]}>Нет заданий в этой категории</Text>
        )}
      </ScrollView>

      {activeTask && (
        <PhotoModal
          task={activeTask}
          onClose={() => setActiveTask(null)}
          onComplete={handleComplete}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pointsBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  pointsText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  pointsValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  filterScroll: { maxHeight: 52 },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: "row",
  },
  filterBtn: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  filterBtnText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  list: { padding: 16, gap: 12, paddingBottom: 32 },
  taskCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  taskTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  catBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  catEmoji: { fontSize: 13 },
  catLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  pointsBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pointsBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  taskTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 20,
  },
  taskDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  doBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
    marginTop: 4,
  },
  doBtnText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  doneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  doneText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    flex: 1,
  },
  thumbPhoto: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 14,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
  },
  modalTask: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  photoButtons: {
    flexDirection: "row",
    gap: 12,
  },
  photoBtn: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 18,
  },
  photoBtnText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  photoPreviewWrap: { gap: 10 },
  photoPreview: {
    width: "100%",
    height: 180,
    borderRadius: 14,
  },
  changePhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    gap: 6,
  },
  changePhotoText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 15,
    gap: 8,
  },
  confirmBtnText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
});
