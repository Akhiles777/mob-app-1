import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useMarathon } from "@/contexts/MarathonContext";

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

export default function MarathonLogin() {
  const { login, loginAdmin } = useMarathon();
  const [phone, setPhone] = useState("");
  const [adminMode, setAdminMode] = useState(false);
  const [adminPass, setAdminPass] = useState("");

  const handleUserLogin = () => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 10) {
      Alert.alert("Введите номер телефона", "Укажите не менее 10 цифр");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    login(phone);
  };

  const handleAdminLogin = () => {
    const ok = loginAdmin(adminPass);
    if (!ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Неверный пароль", "Проверьте введённый пароль");
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: M.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoWrap}>
          <View style={[styles.logoBg, { backgroundColor: M.primary + "20" }]}>
            <Text style={styles.logoEmoji}>🏅</Text>
          </View>
          <Text style={[styles.title, { color: M.primary }]}>Марафон</Text>
          <Text style={[styles.titleSub, { color: M.primary }]}>добрых дел</Text>
          <Text style={[styles.desc, { color: M.muted }]}>
            Выполняйте задания, копите баллы и получайте награды!
          </Text>
        </View>

        {/* Card */}
        <View style={[styles.card, { backgroundColor: M.card, borderColor: M.border }]}>
          {!adminMode ? (
            <>
              <Text style={[styles.cardTitle, { color: M.text }]}>Вход по номеру телефона</Text>
              <View style={[styles.inputWrapper, { borderColor: M.border, backgroundColor: M.input }]}>
                <Feather name="phone" size={16} color={M.mutedLight} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: M.text }]}
                  placeholder="+7 (___) ___-__-__"
                  placeholderTextColor={M.mutedLight}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: M.primary }]}
                onPress={handleUserLogin}
                activeOpacity={0.85}
              >
                <Feather name="arrow-right" size={18} color="#fff" />
                <Text style={styles.btnText}>Войти</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.adminLink}
                onPress={() => setAdminMode(true)}
              >
                <Feather name="settings" size={13} color={M.mutedLight} />
                <Text style={[styles.adminLinkText, { color: M.mutedLight }]}>
                  Вход для администратора
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={[styles.cardTitle, { color: M.text }]}>Вход администратора</Text>
              <View style={[styles.inputWrapper, { borderColor: M.border, backgroundColor: M.input }]}>
                <Feather name="lock" size={16} color={M.mutedLight} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: M.text }]}
                  placeholder="Пароль администратора"
                  placeholderTextColor={M.mutedLight}
                  secureTextEntry
                  value={adminPass}
                  onChangeText={setAdminPass}
                />
              </View>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#7C3AED" }]}
                onPress={handleAdminLogin}
                activeOpacity={0.85}
              >
                <Feather name="shield" size={18} color="#fff" />
                <Text style={styles.btnText}>Войти как администратор</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.adminLink}
                onPress={() => { setAdminMode(false); setAdminPass(""); }}
              >
                <Feather name="arrow-left" size={13} color={M.mutedLight} />
                <Text style={[styles.adminLinkText, { color: M.mutedLight }]}>
                  Назад к обычному входу
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Badges */}
        <View style={styles.badges}>
          {[
            { emoji: "⭐", label: "Баллы за задания" },
            { emoji: "🎁", label: "Обмен на награды" },
            { emoji: "📸", label: "Фотоотчёт" },
          ].map((b) => (
            <View key={b.label} style={[styles.badge, { backgroundColor: M.secondary, borderColor: M.border }]}>
              <Text style={styles.badgeEmoji}>{b.emoji}</Text>
              <Text style={[styles.badgeLabel, { color: M.muted }]}>{b.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  logoWrap: {
    alignItems: "center",
    gap: 6,
  },
  logoBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  logoEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
  },
  titleSub: {
    fontSize: 20,
    fontFamily: "Inter_500Medium",
    marginTop: -4,
  },
  desc: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  card: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 50,
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
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 15,
    gap: 8,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  adminLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 4,
  },
  adminLinkText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  badges: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  badge: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 4,
    minWidth: 90,
  },
  badgeEmoji: {
    fontSize: 22,
  },
  badgeLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
});
