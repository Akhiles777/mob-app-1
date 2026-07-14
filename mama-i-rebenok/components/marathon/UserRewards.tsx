import React, { useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Reward, useMarathon } from "@/contexts/MarathonContext";

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

function RewardModal({
  reward,
  points,
  onClose,
  onRedeem,
}: {
  reward: Reward;
  points: number;
  onClose: () => void;
  onRedeem: () => void;
}) {
  const canAfford = points >= reward.pointsCost;

  const handleDonate = () => {
    Alert.alert(
      "Пожертвование",
      `Чтобы получить эту награду, переведите ${reward.donationAmount} ₽ на счёт центра «Мама и ребенок».\n\nР/с: 40703810416790000005\nБИК: 044525593`,
      [
        { text: "Скопировать реквизиты", onPress: () => {} },
        { text: "Закрыть", style: "cancel" },
      ]
    );
  };

  return (
    <Modal transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: M.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: M.text }]}>Получить награду</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={22} color={M.muted} />
            </TouchableOpacity>
          </View>

          <View style={[styles.rewardEmojiBig, { backgroundColor: M.input }]}>
            <Text style={styles.rewardEmojiBigText}>{reward.emoji}</Text>
          </View>

          <Text style={[styles.rewardModalName, { color: M.text }]}>{reward.title}</Text>
          <Text style={[styles.rewardModalDesc, { color: M.mutedLight }]}>{reward.description}</Text>

          <View style={[styles.balanceRow, { backgroundColor: M.secondary, borderColor: M.border }]}>
            <Text style={[styles.balanceLabel, { color: M.muted }]}>Ваши баллы:</Text>
            <Text style={[styles.balanceValue, { color: M.primary }]}>{points} ⭐</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.redeemBtn,
              { backgroundColor: canAfford ? M.primary : "#D1D5DB" },
            ]}
            onPress={canAfford ? onRedeem : undefined}
            activeOpacity={canAfford ? 0.85 : 1}
          >
            <Feather name="star" size={16} color="#fff" />
            <Text style={styles.redeemBtnText}>
              {canAfford
                ? `Обменять ${reward.pointsCost} баллов`
                : `Не хватает ${reward.pointsCost - points} баллов`}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: M.border }]} />
            <Text style={[styles.dividerText, { color: M.mutedLight }]}>или</Text>
            <View style={[styles.divider, { backgroundColor: M.border }]} />
          </View>

          <TouchableOpacity
            style={[styles.donateBtn, { backgroundColor: "#EEF2FF", borderColor: "#818CF8" }]}
            onPress={handleDonate}
            activeOpacity={0.85}
          >
            <Feather name="heart" size={16} color="#4F46E5" />
            <Text style={[styles.donateBtnText, { color: "#4F46E5" }]}>
              Пожертвовать {reward.donationAmount} ₽ в центр
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function UserRewards() {
  const { rewards, currentUser, redeemReward } = useMarathon();
  const [selected, setSelected] = useState<Reward | null>(null);
  const points = currentUser?.points ?? 0;

  const handleRedeem = () => {
    if (!selected) return;
    const ok = redeemReward(selected.id);
    if (ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "🎉 Награда получена!",
        `Вы обменяли ${selected.pointsCost} баллов на «${selected.title}». Заберите награду в центре!`
      );
    } else {
      Alert.alert("Недостаточно баллов", "Выполните больше заданий, чтобы накопить баллы");
    }
    setSelected(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: M.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: M.primary }]}>
        <Feather name="gift" size={18} color="#fff" />
        <Text style={styles.headerText}>
          Ваши баллы: <Text style={styles.headerPoints}>{points} ⭐</Text>
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        <Text style={[styles.hint, { color: M.muted }]}>
          Нажмите на награду, чтобы обменять баллы или поддержать центр пожертвованием
        </Text>

        {rewards.map((reward) => {
          const canAfford = points >= reward.pointsCost;
          return (
            <TouchableOpacity
              key={reward.id}
              style={[styles.rewardCard, { backgroundColor: M.card, borderColor: M.border }]}
              onPress={() => setSelected(reward)}
              activeOpacity={0.85}
            >
              <View style={[styles.emojiWrap, { backgroundColor: M.input }]}>
                <Text style={styles.emoji}>{reward.emoji}</Text>
              </View>

              <View style={styles.rewardInfo}>
                <Text style={[styles.rewardName, { color: M.text }]}>{reward.title}</Text>
                <Text style={[styles.rewardDesc, { color: M.mutedLight }]} numberOfLines={2}>
                  {reward.description}
                </Text>
                <View style={styles.rewardMeta}>
                  <View style={[styles.costBadge, { backgroundColor: canAfford ? M.primary + "20" : "#F3F4F6" }]}>
                    <Text style={[styles.costText, { color: canAfford ? M.primary : "#9CA3AF" }]}>
                      {reward.pointsCost} ⭐
                    </Text>
                  </View>
                  <Text style={[styles.orText, { color: M.mutedLight }]}>или</Text>
                  <View style={[styles.costBadge, { backgroundColor: "#EEF2FF" }]}>
                    <Text style={[styles.costText, { color: "#4F46E5" }]}>
                      {reward.donationAmount} ₽
                    </Text>
                  </View>
                  {reward.available <= 2 && (
                    <Text style={[styles.availableText, { color: "#EF4444" }]}>
                      Осталось: {reward.available}
                    </Text>
                  )}
                </View>
              </View>

              <Feather name="chevron-right" size={18} color={M.mutedLight} />
            </TouchableOpacity>
          );
        })}

        {rewards.length === 0 && (
          <Text style={[styles.empty, { color: M.mutedLight }]}>Награды скоро появятся</Text>
        )}
      </ScrollView>

      {selected && (
        <RewardModal
          reward={selected}
          points={points}
          onClose={() => setSelected(null)}
          onRedeem={handleRedeem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  headerPoints: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  list: { padding: 16, gap: 12, paddingBottom: 32 },
  hint: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
    marginBottom: 4,
  },
  rewardCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  emojiWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  emoji: { fontSize: 28 },
  rewardInfo: { flex: 1, gap: 4 },
  rewardName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  rewardDesc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 16,
  },
  rewardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
    marginTop: 2,
  },
  costBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  costText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  orText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  availableText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
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
  rewardEmojiBig: {
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  rewardEmojiBigText: { fontSize: 44 },
  rewardModalName: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  rewardModalDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 18,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  balanceValue: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  redeemBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 15,
    gap: 8,
  },
  redeemBtnText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  divider: { flex: 1, height: 1 },
  dividerText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  donateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
  },
  donateBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
});
