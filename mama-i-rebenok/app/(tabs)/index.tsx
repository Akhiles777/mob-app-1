import React, { useState } from "react";
import {
  Alert,
  Linking,
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

interface StatCardProps {
  value: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
}

function StatCard({ value, label, icon, color }: StatCardProps) {
  const colors = useColors();
  return (
    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.statIconBg, { backgroundColor: color + "20" }]}>
        <Feather name={icon} size={22} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

interface SectionProps {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  children: React.ReactNode;
}

function Section({ title, icon, children }: SectionProps) {
  const colors = useColors();
  return (
    <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIconBg, { backgroundColor: colors.secondary }]}>
          <Feather name={icon} size={18} color={colors.primary} />
        </View>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function ContactRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  onPress?: () => void;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      style={styles.contactRow}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={[styles.contactIcon, { backgroundColor: colors.secondary }]}>
        <Feather name={icon} size={16} color={colors.primary} />
      </View>
      <View style={styles.contactText}>
        <Text style={[styles.contactLabel, { color: colors.mutedForeground }]}>{label}</Text>
        <Text style={[styles.contactValue, { color: onPress ? colors.primary : colors.foreground }]}>
          {value}
        </Text>
      </View>
      {onPress && <Feather name="chevron-right" size={16} color={colors.mutedForeground} />}
    </TouchableOpacity>
  );
}

function RekvizitRow({ label, value }: { label: string; value: string }) {
  const colors = useColors();

  const handleCopy = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Скопировано", value);
  };

  return (
    <TouchableOpacity style={styles.rekvizitRow} onPress={handleCopy} activeOpacity={0.7}>
      <View style={styles.rekvizitText}>
        <Text style={[styles.rekvizitLabel, { color: colors.mutedForeground }]}>{label}</Text>
        <Text style={[styles.rekvizitValue, { color: colors.foreground }]}>{value}</Text>
      </View>
      <Feather name="copy" size={14} color={colors.mutedForeground} />
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = isWeb ? 34 + 84 : insets.bottom + 80;

  const [volunteerName, setVolunteerName] = useState("");
  const [volunteerPhone, setVolunteerPhone] = useState("");
  const [volunteerMessage, setVolunteerMessage] = useState("");
  const [volunteerSent, setVolunteerSent] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorMessage, setDonorMessage] = useState("");
  const [donorSent, setDonorSent] = useState(false);

  const handleVolunteerSubmit = () => {
    if (!volunteerName.trim() || !volunteerPhone.trim()) {
      Alert.alert("Заполните обязательные поля", "Укажите имя и телефон");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setVolunteerSent(true);
    setVolunteerName("");
    setVolunteerPhone("");
    setVolunteerMessage("");
    setTimeout(() => setVolunteerSent(false), 4000);
  };

  const handleDonorSubmit = () => {
    if (!donorName.trim() || !donorPhone.trim()) {
      Alert.alert("Заполните обязательные поля", "Укажите имя и телефон");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setDonorSent(true);
    setDonorName("");
    setDonorPhone("");
    setDonorMessage("");
    setTimeout(() => setDonorSent(false), 4000);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad + 16, paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.appTitle, { color: colors.primary }]}>Мама и ребёнок</Text>
          <Text style={[styles.appSubtitle, { color: colors.mutedForeground }]}>
            Центр социальной помощи
          </Text>
        </View>
        <View style={[styles.heartBadge, { backgroundColor: colors.secondary }]}>
          <Feather name="heart" size={24} color={colors.primary} />
        </View>
      </View>

      {/* Stats */}
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Наша работа</Text>
      <View style={styles.statsGrid}>
        <StatCard value="30+" label="семей получили помощь" icon="users" color={colors.primary} />
        <StatCard value="50+" label="детей получили вещи" icon="gift" color={colors.warm} />
        <StatCard value="10+" label="консультаций проведено" icon="message-circle" color={colors.success} />
        <StatCard value="3" label="года работы" icon="award" color="#7C4DFF" />
      </View>

      {/* Contacts */}
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Информация</Text>
      <Section title="Наши контакты" icon="phone">
        <ContactRow
          icon="phone"
          label="Телефон"
          value="+7 (900) 033-08-00"
          onPress={() => Linking.openURL("tel:+79000330800")}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <ContactRow
          icon="mail"
          label="Электронная почта"
          value="help.mom@list.ru"
          onPress={() => Linking.openURL("mailto:help.mom@list.ru")}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <ContactRow
          icon="map-pin"
          label="Адрес"
          value={"г. Артёмовский, ул. 8 Марта,\nд. 20а, офис 1"}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <ContactRow
          icon="clock"
          label="Приём"
          value="Каждый четверг с 12:00 до 16:00"
        />
      </Section>

      {/* Volunteer */}
      <Section title="Стать волонтёром" icon="user-plus">
        <Text style={[styles.formDesc, { color: colors.mutedForeground }]}>
          Хотите помочь нашему центру? Заполните форму и мы свяжемся с вами.
        </Text>
        {volunteerSent ? (
          <View style={[styles.successBox, { backgroundColor: colors.success + "15", borderColor: colors.success + "40" }]}>
            <Feather name="check-circle" size={20} color={colors.success} />
            <Text style={[styles.successText, { color: colors.success }]}>
              Заявка отправлена! Мы свяжемся с вами.
            </Text>
          </View>
        ) : (
          <>
            <View style={[styles.inputWrapper, { borderColor: colors.input, backgroundColor: colors.background }]}>
              <Feather name="user" size={16} color={colors.mutedForeground} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Ваше имя *"
                placeholderTextColor={colors.mutedForeground}
                value={volunteerName}
                onChangeText={setVolunteerName}
              />
            </View>
            <View style={[styles.inputWrapper, { borderColor: colors.input, backgroundColor: colors.background }]}>
              <Feather name="phone" size={16} color={colors.mutedForeground} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Телефон *"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="phone-pad"
                value={volunteerPhone}
                onChangeText={setVolunteerPhone}
              />
            </View>
            <View style={[styles.inputWrapper, styles.textAreaWrapper, { borderColor: colors.input, backgroundColor: colors.background }]}>
              <TextInput
                style={[styles.input, styles.textArea, { color: colors.foreground }]}
                placeholder="Чем хотите помочь?"
                placeholderTextColor={colors.mutedForeground}
                multiline
                numberOfLines={3}
                value={volunteerMessage}
                onChangeText={setVolunteerMessage}
                textAlignVertical="top"
              />
            </View>
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: colors.primary }]}
              onPress={handleVolunteerSubmit}
              activeOpacity={0.85}
            >
              <Feather name="send" size={16} color="#fff" />
              <Text style={styles.submitBtnText}>Отправить заявку</Text>
            </TouchableOpacity>
          </>
        )}
      </Section>

      {/* Want to help / Donations */}
      <Section title="Хочу помочь" icon="heart">
        <Text style={[styles.formDesc, { color: colors.mutedForeground }]}>
          Вы можете поддержать наш центр финансово или передать необходимые вещи.
        </Text>
        {donorSent ? (
          <View style={[styles.successBox, { backgroundColor: colors.success + "15", borderColor: colors.success + "40" }]}>
            <Feather name="check-circle" size={20} color={colors.success} />
            <Text style={[styles.successText, { color: colors.success }]}>
              Спасибо! Мы свяжемся с вами.
            </Text>
          </View>
        ) : (
          <>
            <View style={[styles.inputWrapper, { borderColor: colors.input, backgroundColor: colors.background }]}>
              <Feather name="user" size={16} color={colors.mutedForeground} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Ваше имя *"
                placeholderTextColor={colors.mutedForeground}
                value={donorName}
                onChangeText={setDonorName}
              />
            </View>
            <View style={[styles.inputWrapper, { borderColor: colors.input, backgroundColor: colors.background }]}>
              <Feather name="phone" size={16} color={colors.mutedForeground} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Телефон *"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="phone-pad"
                value={donorPhone}
                onChangeText={setDonorPhone}
              />
            </View>
            <View style={[styles.inputWrapper, styles.textAreaWrapper, { borderColor: colors.input, backgroundColor: colors.background }]}>
              <TextInput
                style={[styles.input, styles.textArea, { color: colors.foreground }]}
                placeholder="Что хотите передать или как помочь?"
                placeholderTextColor={colors.mutedForeground}
                multiline
                numberOfLines={3}
                value={donorMessage}
                onChangeText={setDonorMessage}
                textAlignVertical="top"
              />
            </View>
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: colors.warm }]}
              onPress={handleDonorSubmit}
              activeOpacity={0.85}
            >
              <Feather name="gift" size={16} color="#fff" />
              <Text style={styles.submitBtnText}>Хочу помочь</Text>
            </TouchableOpacity>
          </>
        )}
      </Section>

      {/* Реквизиты */}
      <Section title="Реквизиты" icon="credit-card">
        <Text style={[styles.formDesc, { color: colors.mutedForeground }]}>
          Нажмите на строку, чтобы скопировать значение
        </Text>
        <RekvizitRow label="Получатель" value='Центр «Мама и ребенок»' />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <RekvizitRow label="Расчётный счёт" value="40703810416790000005" />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <RekvizitRow label="Банк" value="АО «АЛЬФА-БАНК» г. Москва" />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <RekvizitRow label="Корр. счёт" value="30101810200000000593" />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <RekvizitRow label="БИК" value="044525593" />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <RekvizitRow label="ИНН" value="6677017306" />
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
  },
  appSubtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  heartBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: "44%",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    alignItems: "flex-start",
    shadowColor: "#C95B7A",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    lineHeight: 32,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
    lineHeight: 16,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 10,
  },
  sectionIconBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  contactIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  contactText: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    lineHeight: 20,
  },
  divider: {
    height: 1,
    marginHorizontal: 0,
  },
  rekvizitRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 8,
  },
  rekvizitText: {
    flex: 1,
  },
  rekvizitLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginBottom: 2,
  },
  rekvizitValue: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  formDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
    marginBottom: 14,
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
    minHeight: 72,
    paddingTop: 4,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    marginTop: 4,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  successBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  successText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
});
