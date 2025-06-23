import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {
  User,
  Bell,
  Shield,
  CircleHelp as HelpCircle,
  Info,
  ChevronRight,
  LogOut,
  Settings as SettingsIcon,
  LucideProps,
} from 'lucide-react-native';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// --- Tipos ---
interface SettingsRowProps {
  icon: React.FC<LucideProps>;
  iconBgColor: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

// --- Componentes Reutilizáveis ---
const SettingsRow: React.FC<SettingsRowProps> = ({
  icon: Icon,
  iconBgColor,
  title,
  subtitle,
  onPress,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <AnimatedTouchableOpacity
      style={[styles.settingsRow, animatedStyle]}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={1}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        <Icon size={22} color="#FFFFFF" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.settingsTitle}>{title}</Text>
        <Text style={styles.settingsSubtitle}>{subtitle}</Text>
      </View>
      <ChevronRight size={22} color="#9CA3AF" />
    </AnimatedTouchableOpacity>
  );
};

// --- Tela Principal ---
export default function SettingsScreen() {
  const settingsOptions = [
    {
      id: '1',
      title: 'Perfil',
      subtitle: 'Gerencie suas informações pessoais',
      icon: User,
      iconBgColor: '#6D28D9', // Roxo
      onPress: () => console.log('Profile'),
    },
    {
      id: '2',
      title: 'Notificações',
      subtitle: 'Configure suas preferências',
      icon: Bell,
      iconBgColor: '#F59E0B', // Amarelo/Laranja
      onPress: () => console.log('Notifications'),
    },
    {
      id: '3',
      title: 'Privacidade',
      subtitle: 'Controle sua privacidade e dados',
      icon: Shield,
      iconBgColor: '#10B981', // Verde
      onPress: () => console.log('Privacy'),
    },
    {
      id: '4',
      title: 'Ajuda',
      subtitle: 'Encontre respostas para suas dúvidas',
      icon: HelpCircle,
      iconBgColor: '#3B82F6', // Azul
      onPress: () => console.log('Help'),
    },
    {
      id: '5',
      title: 'Sobre',
      subtitle: 'Informações sobre o aplicativo',
      icon: Info,
      iconBgColor: '#6B7280', // Cinza
      onPress: () => console.log('About'),
    },
  ];

  const scaleLogout = useSharedValue(1);
  const animatedLogoutStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleLogout.value }],
  }));
  const onLogoutPressIn = () => {
    scaleLogout.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  };
  const onLogoutPressOut = () => {
    scaleLogout.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <SettingsIcon size={30} color="#111827" />
            <Text style={styles.headerTitle}>Ajustes</Text>
          </View>
          <Text style={styles.headerSubtitle}>Personalize sua experiência</Text>

          {/* Settings Options */}
          <View style={styles.settingsGroup}>
            {settingsOptions.map(option => (
              <SettingsRow
                key={option.id}
                icon={option.icon}
                iconBgColor={option.iconBgColor}
                title={option.title}
                subtitle={option.subtitle}
                onPress={option.onPress}
              />
            ))}
          </View>

          {/* Logout Button */}
          <AnimatedTouchableOpacity
            style={[styles.logoutButton, animatedLogoutStyle]}
            onPress={() => console.log('Logout')}
            onPressIn={onLogoutPressIn}
            onPressOut={onLogoutPressOut}
            activeOpacity={1}
          >
            <LogOut size={22} color="#EF4444" />
            <Text style={styles.logoutText}>Sair da conta</Text>
          </AnimatedTouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Fundo cinza claro
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 30,
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 30,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 999, // Círculo
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  settingsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444', // Vermelho
  },
});