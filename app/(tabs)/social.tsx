import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Send, Share2, MessageCircle, Heart, MapPin, Calendar, Users } from 'lucide-react-native';
import { Mail, LogIn, UserPlus, Users as UsersIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useDataSharing, useTrips, useProfile } from '../../hooks/useStorage';
import InvitationsModal from '../../components/InvitationsModal';

interface Comment {
  id: string;
  user: string;
  avatar: string;
  message: string;
  timestamp: string;
  type: 'trip' | 'day' | 'place';
  contextId: string;
}

interface SharedTrip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  image: string;
  sharedBy: string;
  participants: number;
  likes: number;
  comments: number;
  liked: boolean;
}

export default function SocialScreen() {
  const [activeTab, setActiveTab] = useState<'feed' | 'shared' | 'comments'>('feed');
  const [newComment, setNewComment] = useState('');
  const [showInvitations, setShowInvitations] = useState(false);
  const { sharing, generateShareLink } = useDataSharing();
  const { getPublicTrips } = useTrips();
  const { profile, isLoggedIn, checkLoginStatus } = useProfile();
  const [publicTrips, setPublicTrips] = useState<any[]>([]);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [sharedTrips] = useState<SharedTrip[]>([
    {
      id: '1',
      title: 'Mediterranean Cruise',
      destination: 'Greece & Italy',
      startDate: '2024-07-01',
      endDate: '2024-07-14',
      image: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=800',
      sharedBy: 'Sarah Johnson',
      participants: 4,
      likes: 24,
      comments: 8,
      liked: false,
    },
    {
      id: '2',
      title: 'Mountain Adventure',
      destination: 'Swiss Alps',
      startDate: '2024-08-15',
      endDate: '2024-08-22',
      image: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=800',
      sharedBy: 'Mike Chen',
      participants: 2,
      likes: 18,
      comments: 5,
      liked: true,
    },
  ]);

  // Load public trips
  React.useEffect(() => {
    const initializeSocialData = async () => {
      try {
        setAuthLoading(true);
        
        // Check authentication status
        const loginStatus = await checkLoginStatus();
        
        // Load public trips regardless of auth status
        const trips = await getPublicTrips();
        setPublicTrips(trips);
      } catch (error) {
        console.error('Error loading social data:', error);
      } finally {
        setAuthLoading(false);
      }
    };

    initializeSocialData();
  }, []);

  const [comments] = useState<Comment[]>([
    {
      id: '1',
      user: 'Emma Wilson',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      message: 'This itinerary looks amazing! How many days are you planning for the Louvre?',
      timestamp: '2h ago',
      type: 'trip',
      contextId: '1',
    },
    {
      id: '2',
      user: 'David Kim',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      message: 'Great choice for Day 2! The Montmartre district is perfect for sunset.',
      timestamp: '4h ago',
      type: 'day',
      contextId: 'day-2',
    },
    {
      id: '3',
      user: 'Lisa Rodriguez',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      message: 'Café de Flore is overrated. Try Le Procope instead - much better atmosphere!',
      timestamp: '6h ago',
      type: 'place',
      contextId: 'cafe-de-flore',
    },
  ]);

  const handleShare = async () => {
    Alert.alert(
      'Share Trip',
      'How would you like to share your trip?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Generate Share Link', 
          onPress: async () => {
            try {
              const shareLink = await generateShareLink();
              Alert.alert(
                'Share Link Generated',
                'Your travel data has been packaged into a shareable link.',
                [
                  { text: 'Copy Link', onPress: () => Alert.alert('Link copied to clipboard!') },
                  { text: 'OK' }
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to generate share link');
            }
          }
        },
        { text: 'Social Media', onPress: () => Alert.alert('Opening social media options...') },
      ]
    );
  };

  const handleLike = (tripId: string) => {
    Alert.alert('Liked!', 'Trip has been liked');
  };

  const handleSendComment = () => {
    if (newComment.trim()) {
      Alert.alert('Comment Posted', 'Your comment has been added to the discussion');
      setNewComment('');
    }
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleRegister = () => {
    router.push('/auth/register');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Show authentication prompt for non-logged in users
  const renderAuthPrompt = () => (
    <View style={styles.authPrompt}>
      <Text style={styles.authPromptTitle}>Welcome to TripSee Social!</Text>
      <Text style={styles.authPromptDescription}>
        Discover amazing trips shared by travelers around the world. Sign in to share your own adventures and connect with fellow explorers.
      </Text>
      
      <View style={styles.authButtons}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <LogIn size={16} color="#FFFFFF" />
          <Text style={styles.loginButtonText}>Sign In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <UserPlus size={16} color="#2563EB" />
          <Text style={styles.registerButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFeed = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Show auth prompt for non-logged in users */}
      {!isLoggedIn && renderAuthPrompt()}
      
      {/* Public Trips from Storage */}
      {publicTrips.map((trip) => (
        <View key={trip.id} style={styles.tripCard}>
          <Image source={{ uri: trip.image }} style={styles.tripImage} />
          
          <View style={styles.tripContent}>
            <View style={styles.tripHeader}>
              <Text style={styles.tripTitle}>{trip.title}</Text>
              <Text style={styles.sharedBy}>by {trip.createdBy}</Text>
            </View>
            
            <View style={styles.tripDetail}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.tripDestination}>{trip.destination}</Text>
            </View>
            
            <View style={styles.tripDetail}>
              <Calendar size={16} color="#6B7280" />
              <Text style={styles.tripDates}>
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </Text>
            </View>
            
            <View style={styles.tripDetail}>
              <Users size={16} color="#6B7280" />
              <Text style={styles.tripParticipants}>{trip.participants || 1} travelers</Text>
            </View>
            
            <View style={styles.tripActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleLike(trip.id)}
                disabled={!isLoggedIn}
              >
                <Heart size={20} color="#6B7280" />
                <Text style={styles.actionText}>Like</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                disabled={!isLoggedIn}
              >
                <MessageCircle size={20} color="#6B7280" />
                <Text style={styles.actionText}>Comment</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}
                disabled={!isLoggedIn}
              >
                <Share2 size={20} color="#6B7280" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      {/* Sample Shared Trips */}
      {sharedTrips.map((trip) => (
        <View key={trip.id} style={styles.tripCard}>
          <Image source={{ uri: trip.image }} style={styles.tripImage} />
          
          <View style={styles.tripContent}>
            <View style={styles.tripHeader}>
              <Text style={styles.tripTitle}>{trip.title}</Text>
              <Text style={styles.sharedBy}>by {trip.sharedBy}</Text>
            </View>
            
            <View style={styles.tripDetail}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.tripDestination}>{trip.destination}</Text>
            </View>
            
            <View style={styles.tripDetail}>
              <Calendar size={16} color="#6B7280" />
              <Text style={styles.tripDates}>
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </Text>
            </View>
            
            <View style={styles.tripDetail}>
              <Users size={16} color="#6B7280" />
              <Text style={styles.tripParticipants}>{trip.participants} travelers</Text>
            </View>
            
            <View style={styles.tripActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleLike(trip.id)}
                disabled={!isLoggedIn}
              >
                <Heart
                  size={20}
                  color={trip.liked ? "#EF4444" : "#6B7280"}
                  fill={trip.liked ? "#EF4444" : "transparent"}
                />
                <Text style={styles.actionText}>{trip.likes}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                disabled={!isLoggedIn}
              >
                <MessageCircle size={20} color="#6B7280" />
                <Text style={styles.actionText}>{trip.comments}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}
                disabled={!isLoggedIn}
              >
                <Share2 size={20} color="#6B7280" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderShared = () => (
    <View style={styles.tabContent}>
      {!isLoggedIn ? (
        <View style={styles.emptyState}>
          <Share2 size={48} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Sign In Required</Text>
          <Text style={styles.emptyDescription}>
            Sign in to share your trip itineraries and get recommendations from fellow travelers.
          </Text>
          <TouchableOpacity style={styles.signInPromptButton} onPress={handleLogin}>
            <LogIn size={20} color="#FFFFFF" />
            <Text style={styles.signInPromptButtonText}>Sign In to Share</Text>
          </TouchableOpacity>
        </View>
      ) : (
      <View style={styles.emptyState}>
        <Share2 size={48} color="#D1D5DB" />
        <Text style={styles.emptyTitle}>Share Your Adventures</Text>
        <Text style={styles.emptyDescription}>
          Share your trip itineraries with friends and get recommendations from fellow travelers.
        </Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Share2 size={20} color="#FFFFFF" />
          <Text style={styles.shareButtonText}>Share Current Trip</Text>
        </TouchableOpacity>
      </View>
      )}
    </View>
  );

  const renderComments = () => (
    <View style={styles.tabContent}>
      {!isLoggedIn ? (
        <View style={styles.emptyState}>
          <MessageCircle size={48} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Sign In Required</Text>
          <Text style={styles.emptyDescription}>
            Sign in to view and participate in trip discussions and comments.
          </Text>
          <TouchableOpacity style={styles.signInPromptButton} onPress={handleLogin}>
            <LogIn size={20} color="#FFFFFF" />
            <Text style={styles.signInPromptButtonText}>Sign In to Comment</Text>
          </TouchableOpacity>
        </View>
      ) : (
      <>
      <ScrollView style={styles.commentsContainer} showsVerticalScrollIndicator={false}>
        {comments.map((comment) => (
          <View key={comment.id} style={styles.commentItem}>
            <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
            <View style={styles.commentContent}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentUser}>{comment.user}</Text>
                <Text style={styles.commentTime}>{comment.timestamp}</Text>
              </View>
              <Text style={styles.commentMessage}>{comment.message}</Text>
              <View style={styles.commentContext}>
                <Text style={styles.commentContextText}>
                  {comment.type === 'trip' && '💼 Trip Discussion'}
                  {comment.type === 'day' && '📅 Daily Itinerary'}
                  {comment.type === 'place' && '📍 Place Comment'}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.commentInput}>
        <TextInput
          style={styles.commentTextInput}
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Add a comment..."
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendComment}
        >
          <Send size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>
      </>
      )}
    </View>
  );

  if (authLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading social feed...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <UsersIcon size={28} color="#111827" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Social</Text>
        </View>
        {isLoggedIn && (
          <TouchableOpacity
            style={styles.invitationsButton}
            onPress={() => router.back()}
          >
            <Mail size={20} color="#2563EB" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'feed' && styles.tabActive]}
          onPress={() => setActiveTab('feed')}
        >
          <Text style={[styles.tabText, activeTab === 'feed' && styles.tabTextActive]}>
            Feed
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'shared' && styles.tabActive]}
          onPress={() => setActiveTab('shared')}
        >
          <Text style={[styles.tabText, activeTab === 'shared' && styles.tabTextActive]}>
            Shared
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'comments' && styles.tabActive]}
          onPress={() => setActiveTab('comments')}
        >
          <Text style={[styles.tabText, activeTab === 'comments' && styles.tabTextActive]}>
            Comments
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'feed' && renderFeed()}
      {activeTab === 'shared' && renderShared()}
      {activeTab === 'comments' && renderComments()}

      {isLoggedIn && (
        <InvitationsModal
          visible={showInvitations}
          onClose={() => setShowInvitations(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  invitationsButton: {
    padding: 8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#2563EB',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#2563EB',
  },
  tabContent: {
    flex: 1,
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tripImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  tripContent: {
    padding: 16,
  },
  tripHeader: {
    marginBottom: 12,
  },
  tripTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  sharedBy: {
    fontSize: 14,
    color: '#6B7280',
  },
  tripDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripDestination: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  tripDates: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  tripParticipants: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  tripActions: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  shareButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  commentsContainer: {
    flex: 1,
    padding: 20,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUser: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  commentTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  commentMessage: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 8,
  },
  commentContext: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  commentContextText: {
    fontSize: 12,
    color: '#6B7280',
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  commentTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
  authPrompt: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  authPromptTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  authPromptDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  authButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  loginButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  registerButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  registerButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  signInPromptButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signInPromptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});