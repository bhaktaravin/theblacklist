import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

// Reddington-style quotes
const REDDINGTON_QUOTES = [
  "I'm a criminal. Criminals are notorious liars. Everything about me is a lie.",
  "The truth is, I'm not who you think I am.",
  "In this business, you have to think like your enemy.",
  "Everyone has a weakness. The trick is finding it.",
  "Trust is a luxury I can't afford.",
  "Sometimes the only way to catch a criminal is to think like one.",
  "Secrets are the currency of power."
];

// Animated Background Component
const AnimatedBackground = () => {
  const particles = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      opacity: new Animated.Value(Math.random() * 0.3 + 0.1),
      scale: new Animated.Value(Math.random() * 0.5 + 0.5),
    }))
  ).current;

  const scanLine = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Floating particles animation
    particles.forEach((particle) => {
      const animateParticle = () => {
        Animated.parallel([
          Animated.timing(particle.x, {
            toValue: Math.random() * width,
            duration: 8000 + Math.random() * 4000,
            useNativeDriver: true,
          }),
          Animated.timing(particle.y, {
            toValue: Math.random() * height,
            duration: 6000 + Math.random() * 6000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(particle.opacity, {
              toValue: Math.random() * 0.4 + 0.2,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: Math.random() * 0.1 + 0.05,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => animateParticle());
      };
      animateParticle();
    });

    // Scanning line animation
    const animateScanLine = () => {
      Animated.sequence([
        Animated.timing(scanLine, {
          toValue: height + 100,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLine, {
          toValue: -100,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(animateScanLine, 3000);
      });
    };
    animateScanLine();
  }, []);

  return (
    <Animated.View style={styles.animatedBackground}>
      {/* Floating particles */}
      {particles.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            {
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}
      
      {/* Scanning line */}
      <Animated.View
        style={[
          styles.scanLine,
          {
            transform: [{ translateY: scanLine }],
          },
        ]}
      />
      
      {/* Grid overlay */}
      <ThemedView style={styles.gridOverlay} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    height: 350,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2,
  },
  // New animated background styles
  animatedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#ff4444',
    borderRadius: 2,
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 5,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 68, 68, 0.8)',
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 10,
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 68, 68, 0.1)',
    borderWidth: 0.5,
  },
  logo: {
    width: 200,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff4444',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff4444',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#ff4444',
    paddingBottom: 5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#e0e0e0',
    marginBottom: 25,
    textAlign: 'justify',
  },
  featuresContainer: {
    marginVertical: 20,
  },
  featureContainer: {
    marginVertical: 20,
  },
  featureCard: {
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
  },
  featureIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
    backgroundColor: '#ff4444',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 18,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 18,
  },
  navigationContainer: {
    marginTop: 30,
  },
  navigationLinks: {
    marginTop: 30,
  },
  link: {
    marginBottom: 10,
  },
  linkButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  linkText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  quoteContainer: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#e0e0e0',
    textAlign: 'center',
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#ff4444',
    textAlign: 'right',
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default function HomeScreen() {
  const pulse = useRef(new Animated.Value(1)).current;
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const quoteOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation for title
    const animatePulse = () => {
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => animatePulse());
    };
    animatePulse();

    // Rotating quotes animation
    const rotateQuotes = () => {
      Animated.sequence([
        Animated.timing(quoteOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(quoteOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
      
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % REDDINGTON_QUOTES.length);
      }, 500);
    };

    const quoteInterval = setInterval(rotateQuotes, 6000);
    return () => clearInterval(quoteInterval);
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#0a0a0a', dark: '#0a0a0a' }}
      headerImage={
        <ThemedView style={styles.header}>
          <AnimatedBackground />
          <ThemedView style={styles.backgroundOverlay} />
          <Animated.Text 
            style={[
              styles.title,
              {
                transform: [{ scale: pulse }],
                zIndex: 3,
              },
            ]}
          >
            THE BLACKLIST
          </Animated.Text>
          <ThemedText style={[styles.subtitle, { zIndex: 3 }]}>FBI Criminal Database</ThemedText>
        </ThemedView>
      }>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.description}>
          Welcome to the FBI's classified criminal database. Access profiles of the world's most wanted criminals and classified intelligence reports.
        </ThemedText>

        <Animated.View style={[styles.quoteContainer, { opacity: quoteOpacity }]}>
          <ThemedText style={styles.quote}>
            "{REDDINGTON_QUOTES[currentQuoteIndex]}"
          </ThemedText>
          <ThemedText style={styles.quoteAuthor}>
            — Raymond "Red" Reddington
          </ThemedText>
        </Animated.View>

        <ThemedView style={styles.featureContainer}>
          <ThemedView style={styles.featureCard}>
            <ThemedText style={styles.featureTitle}>🔍 Criminal Database</ThemedText>
            <ThemedText style={styles.featureText}>
              Browse and manage profiles of high-priority criminals and fugitives
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.featureCard}>
            <ThemedText style={styles.featureTitle}>📋 Case Files</ThemedText>
            <ThemedText style={styles.featureText}>
              Access classified documents and intelligence reports
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.featureCard}>
            <ThemedText style={styles.featureTitle}>👥 FBI Personnel</ThemedText>
            <ThemedText style={styles.featureText}>
              View profiles of key FBI agents and task force members
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.navigationContainer}>
          <Link href="/explore" style={styles.link}>
            <ThemedText style={styles.linkText}>Access Criminal Database →</ThemedText>
          </Link>
          
          <Link href="/modal" style={styles.link}>
            <ThemedText style={styles.linkText}>View FBI Personnel →</ThemedText>
          </Link>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}
