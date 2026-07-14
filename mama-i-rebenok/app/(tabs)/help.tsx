import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";

const URGENCY_LABELS = [
  { level: 1, label: "Не срочно", color: "#4CAF50", desc: "Помощь нужна, но есть время" },
  { level: 2, label: "Умеренно", color: "#FF9800", desc: "Желательно в ближайший месяц" },
  { level: 3, label: "Срочно", color: "#F44336", desc: "Нужна помощь как можно скорее" },
];

const NEXT_THURSDAYS = (() => {
  const dates: string[] = [];
  const today = new Date();
  let d = new Date(today);
  d.setHours(0, 0, 0, 0);
  while (dates.length < 4) {
    if (d.getDay() === 4) {
      const dateStr = d.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      dates.push(dateStr);
    }
    d.setDate(d.getDate() + 1);
  }
  return dates;
})();

export default function HelpScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = isWeb ? 34 + 84 : insets.bottom + 80;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const urgencyInfo = URGENCY_LABELS[urgency - 1];

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Заполните обязательные поля", "Укажите имя и телефон");
      return;
    }
    if (!selectedDate) {
      Alert.alert("Выберите дату", "Пожалуйста, выберите удобный день приёма");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSent(true);
    setName("");
    setPhone("");
    setDescription("");
    setUrgency(1);
    setSelectedDate(null);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad + 16, paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.headerIcon, { backgroundColor: colors.secondary }]}>
          <Feather name="heart" size={28} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>Нужна помощь</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Заполните заявку и мы поможем вам и вашему ребёнку
        </Text>
      </View>

      {/* Schedule info */}
      <View style={[styles.scheduleCard, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}>
        <View style={styles.scheduleRow}>
          <View style={[styles.scheduleIcon, { backgroundColor: colors.primary + "20" }]}>
            <Feather name="calendar" size={18} color={colors.primary} />
          </View>
          <View style={styles.scheduleText}>
            <Text style={[styles.scheduleTitle, { color: colors.primary }]}>График приёма</Text>
            <Text style={[styles.scheduleDesc, { color: colors.foreground }]}>
              Каждый четверг месяца
            </Text>
            <Text style={[styles.scheduleTime, { color: colors.mutedForeground }]}>
              с 12:00 до 16:00
            </Text>
          </View>
        </View>
        <View style={[styles.scheduleDivider, { backgroundColor: colors.primary + "20" }]} />
        <Text style={[styles.scheduleAddr, { color: colors.mutedForeground }]}>
          г. Артёмовский, ул. 8 Марта, д. 20а, офис 1
        </Text>
      </View>

      {/* Form card */}
      {sent ? (
        <View style={[styles.successCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.successIcon, { backgroundColor: "#4CAF50" + "20" }]}>
            <Feather name="check-circle" size={36} color="#4CAF50" />
          </View>
          <Text style={[styles.successTitle, { color: colors.foreground }]}>Заявка отправлена!</Text>
          <Text style={[styles.successDesc, { color: colors.mutedForeground }]}>
            Мы получили вашу заявку и свяжемся с вами для подтверждения записи.
          </Text>
          <Text style={[styles.successContact, { color: colors.primary }]}>
            +7 (900) 033-08-00
          </Text>
        </View>
      ) : (
        <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.formTitle, { color: colors.foreground }]}>Заявка на приём</Text>

          {/* Name */}
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Ваше имя *</Text>
          <View style={[styles.inputWrapper, { borderColor: colors.input, backgroundColor: colors.background }]}>
            <Feather name="user" size={16} color={colors.mutedForeground} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Введите имя"
              placeholderTextColor={colors.mutedForeground}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Phone */}
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Телефон *</Text>
          <View style={[styles.inputWrapper, { borderColor: colors.input, backgroundColor: colors.background }]}>
            <Feather name="phone" size={16} color={colors.mutedForeground} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="+7 (___) ___-__-__"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Description */}
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Опишите ситуацию</Text>
          <View style={[styles.inputWrapper, styles.textAreaWrapper, { borderColor: colors.input, backgroundColor: colors.background }]}>
            <TextInput
              style={[styles.input, styles.textArea, { color: colors.foreground }]}
              placeholder="Расскажите, какая помощь вам нужна..."
              placeholderTextColor={colors.mutedForeground}
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />
          </View>

          {/* Urgency Slider */}
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Срочность помощи</Text>
          <View style={[styles.urgencyCard, { backgroundColor: urgencyInfo.color + "10", borderColor: urgencyInfo.color + "30" }]}>
            <View style={styles.urgencyOptions}>
              {URGENCY_LABELS.map((item) => (
                <TouchableOpacity
                  key={item.level}
                  style={[
                    styles.urgencyBtn,
                    urgency === item.level && { backgroundColor: item.color, borderColor: item.color },
                    urgency !== item.level && { borderColor: colors.border, backgroundColor: colors.background },
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setUrgency(item.level);
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.urgencyBtnText,
                      urgency === item.level ? { color: "#fff" } : { color: colors.mutedForeground },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.urgencyDesc}>
              <View style={[styles.urgencyDot, { backgroundColor: urgencyInfo.color }]} />
              <Text style={[styles.urgencyDescText, { color: urgencyInfo.color }]}>
                {urgencyInfo.desc}
              </Text>
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Feather name="send" size={16} color="#fff" />
            <Text style={styles.submitBtnText}>Отправить заявку</Text>
          </TouchableOpacity>

          <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>
            После отправки мы свяжемся с вами для подтверждения
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 8,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  scheduleCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  scheduleIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  scheduleText: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  scheduleDesc: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  scheduleTime: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  scheduleDivider: {
    height: 1,
    marginVertical: 12,
  },
  scheduleAddr: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  successCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    padding: 32,
    alignItems: "center",
    gap: 12,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  successDesc: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  successContact: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    marginTop: 8,
  },
  formCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  formTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 14,
    minHeight: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    paddingVertical: 12,
  },
  textAreaWrapper: {
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  textArea: {
    minHeight: 88,
    paddingTop: 4,
  },
  urgencyCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 18,
  },
  urgencyOptions: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  urgencyBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  urgencyBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  urgencyDesc: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  urgencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  urgencyDescText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  dateHint: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: -4,
    marginBottom: 10,
  },
  dateList: {
    gap: 8,
    marginBottom: 12,
  },
  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  dateBtnText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  timeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  timeChipText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
    marginTop: 8,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  disclaimer: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 16,
  },
});
