import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  Search,
  Plus,
  Calendar,
  Star,
  ArrowRight,
  Heart,
  Camera,
  LucideProps,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// --- Tipos ---
interface ActionCardProps {
  icon: React.FC<LucideProps>;
  title: string;
  onPress: () => void;
  index: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
  image: string;
  daysLeft: number;
  category: string;
}

interface EventCardProps {
  event: Event;
  index: number;
}


// --- Componentes Reutilizáveis com Animação ---

const ActionCard: React.FC<ActionCardProps> = ({ icon: Icon, title, onPress, index }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    opacity.value = withDelay(200 + index * 100, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(200 + index * 100, withSpring(0, { damping: 12, stiffness: 100 }));
  }, []);
  
  const animatedCardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const animatedPressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.95);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };
  
  return (
    <Animated.View style={animatedCardStyle}>
      <AnimatedTouchableOpacity
        onPress={onPress}
        style={[styles.actionCard, animatedPressStyle]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <View style={styles.actionIconContainer}>
          <Icon size={24} color="#FFFFFF" />
        </View>
        <Text style={styles.actionCardTitle}>{title}</Text>
      </AnimatedTouchableOpacity>
    </Animated.View>
  );
};

const EventCard: React.FC<EventCardProps> = ({ event, index }) => {
  const scale = useSharedValue(1);
    const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    opacity.value = withDelay(500 + index * 150, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(500 + index * 150, withSpring(0, { damping: 15, stiffness: 100 }));
  }, []);

  const animatedCardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const animatedPressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const onPressIn = () => {
    scale.value = withSpring(0.98);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={animatedCardStyle}>
      <AnimatedTouchableOpacity
        onPress={() => console.log('View Event')}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={animatedPressStyle}
      >
        <ImageBackground
          source={{ uri: event.image }}
          style={styles.eventCard}
          imageStyle={{ borderRadius: 20 }}
        >
          <View style={styles.eventCardOverlay}>
            <View style={styles.eventCardHeader}>
              <Text style={styles.eventDaysLeft}>{event.daysLeft} dias</Text>
              <Text style={styles.eventCategory}>{event.category}</Text>
            </View>
            <View style={styles.eventCardFooter}>
              <View>
                <Text style={styles.eventDate}>{event.date}</Text>
                <Text style={styles.eventTitle}>{event.title}</Text>
              </View>
              <View style={styles.eventCardActions}>
                <TouchableOpacity style={styles.eventActionButton}>
                  <Heart size={18} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.eventActionButton}>
                  <Camera size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </AnimatedTouchableOpacity>
    </Animated.View>
  );
};


// --- Tela Principal ---

export default function HomeScreen() {
  const [searchText, setSearchText] = useState('');
  const [events, setEvents] = useState<Event[]>([]);

  // Animações de entrada da tela
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-50);
  const searchOpacity = useSharedValue(0);
  const searchTranslateY = useSharedValue(50);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) });
    headerTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    
    searchOpacity.value = withDelay(100, withTiming(1, { duration: 500 }));
    searchTranslateY.value = withDelay(100, withSpring(0, { damping: 12, stiffness: 100 }));
    
    // Simulação de dados
    const mockEvents = [
      { id: '1', title: 'Testando', date: '22/06/2025', image: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800', daysLeft: 0, category: 'Tech' },
      { id: '2', title: 'Conferência Tech', date: '15/07/2025', image: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800', daysLeft: 0, category: 'Business' },
    ];
    setEvents(
      mockEvents.map(event => ({ ...event, daysLeft: calculateDaysLeft(event.date) }))
    );
  }, []);

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));
  
  const animatedSearchStyle = useAnimatedStyle(() => ({
    opacity: searchOpacity.value,
    transform: [{ translateY: searchTranslateY.value }],
  }));

  const calculateDaysLeft = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    const eventDate = new Date(+year, +month - 1, +day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const actionCardsData = [
    { id: '1', title: 'Criar novo evento', icon: Plus, onPress: () => console.log('Create') },
    { id: '2', title: 'Galeria de eventos', icon: Calendar, onPress: () => console.log('Gallery') },
    { id: '3', title: 'Efeitos de vídeo', icon: Star, onPress: () => console.log('Effects') },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <Animated.View style={[styles.header, animatedHeaderStyle]}>
            <View>
              <Text style={styles.welcomeText}>Seja bem vindo</Text>
              <Text style={styles.welcomeSubtext}>Gerencie seus eventos com estilo</Text>
            </View>
            <TouchableOpacity style={styles.arrowButton}>
              <ArrowRight size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>

          {/* Search Bar */}
          <Animated.View style={animatedSearchStyle}>
            <View style={styles.searchContainer}>
              <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar eventos..."
                placeholderTextColor="#9CA3AF"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          </Animated.View>

          {/* Action Cards */}
          <View style={styles.actionCardsContainer}>
            {actionCardsData.map((card, index) => (
              <ActionCard
                key={card.id}
                icon={card.icon}
                title={card.title}
                onPress={card.onPress}
                index={index}
              />
            ))}
          </View>

          {/* Upcoming Events Section */}
          <Animated.View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Últimos eventos</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllButton}>Ver todos →</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Events List */}
          <View style={styles.eventsList}>
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// --- Estilos ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Cinza claro de fundo
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Espaço para a TabBar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#6B7280',
  },
  arrowButton: {
    backgroundColor: '#6D28D9', // Roxo
    padding: 12,
    borderRadius: 999, // Círculo
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#111827',
  },
  actionCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionCard: {
    alignItems: 'center',
    width: (width - 60) / 3, // Largura distribuída
  },
  actionIconContainer: {
    backgroundColor: '#6D28D9', // Roxo
    borderRadius: 20,
    padding: 20,
    marginBottom: 10,
  },
  actionCardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  seeAllButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6D28D9',
  },
  eventsList: {
    gap: 20,
  },
  eventCard: {
    height: 220,
    borderRadius: 20,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  eventCardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // Overlay escuro
    padding: 15,
    justifyContent: 'space-between',
  },
  eventCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventDaysLeft: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  eventCategory: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  eventCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  eventDate: {
    fontSize: 14,
    color: '#E5E7EB',
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  eventCardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  eventActionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 999,
  },
});