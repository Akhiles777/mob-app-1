import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { MarathonProvider, useMarathon } from "@/contexts/MarathonContext";
import MarathonLogin from "@/components/marathon/MarathonLogin";
import UserTasks from "@/components/marathon/UserTasks";
import UserRewards from "@/components/marathon/UserRewards";
import UserProfile from "@/components/marathon/UserProfile";
import AdminPanel from "@/components/marathon/AdminPanel";

type UserTab = "tasks" | "rewards" | "profile";

const USER_TABS: { key: UserTab; icon: keyof typeof Feather.glyphMap; label: string }[] = [
  { key: "tasks", icon: "list", label: "Задания" },
  { key: "rewards", icon: "gift", label: "Награды" },
  { key: "profile", icon: "user", label: "Профиль" },
];

const AMBER = "#F59E0B";

function MarathonInner() {
  const { currentUser, isAdmin } = useMarathon();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? Math.max(insets.top, 67) : insets.top;
  const [userTab, setUserTab] = useState<UserTab>("tasks");

  if (!currentUser && !isAdmin) {
    return (
      <View style={[styles.fill, { paddingTop: topPad, backgroundColor: "#FFFBF0" }]}>
        <MarathonLogin />
      </View>
    );
  }

  if (isAdmin) {
    return (
      <View style={[styles.fill, { paddingTop: topPad, backgroundColor: "#F9F7FF" }]}>
        <AdminPanel />
      </View>
    );
  }

  return (
    <View style={[styles.fill, { backgroundColor: "#FFFBF0" }]}>
      {/* Header with top tab bar */}
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: "#FFFFFF", borderBottomColor: "#FDE68A" }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.headerTitle, { color: AMBER }]}>🏅 Марафон добрых дел</Text>
          <View style={[styles.pointsChip, { backgroundColor: AMBER + "20" }]}>
            <Feather name="star" size={13} color={AMBER} />
            <Text style={[styles.pointsChipText, { color: AMBER }]}>{currentUser?.points ?? 0}</Text>
          </View>
        </View>

        {/* Top tabs */}
        <View style={styles.topTabs}>
          {USER_TABS.map((tab) => {
            const active = userTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.topTab, active && { borderBottomColor: AMBER }]}
                onPress={() => setUserTab(tab.key)}
                activeOpacity={0.7}
              >
                <Feather name={tab.icon} size={16} color={active ? AMBER : "#9CA3AF"} />
                <Text style={[styles.topTabText, { color: active ? AMBER : "#9CA3AF" }]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {userTab === "tasks" && <UserTasks />}
        {userTab === "rewards" && <UserRewards />}
        {userTab === "profile" && <UserProfile />}
      </View>
    </View>
  );
}

export default function MarathonScreen() {
  return (
    <MarathonProvider>
      <MarathonInner />
    </MarathonProvider>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  header: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
  },
  pointsChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  pointsChipText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  topTabs: {
    flexDirection: "row",
  },
  topTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  topTabText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  content: {
    flex: 1,
  },
});
