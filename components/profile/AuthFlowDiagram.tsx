import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ArrowRight, ArrowDown, User, Shield, LogOut, CircleCheck as CheckCircle } from 'lucide-react-native';

/**
 * TripSee Authentication Flow Documentation Component
 * 
 * This component serves as living documentation for the authentication flow
 * and can be used for design reviews and developer reference.
 */

export default function AuthFlowDiagram() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>TripSee Authentication Flow</Text>
      
      {/* User Flow Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Sign-Out Flow</Text>
        
        <View style={styles.flowStep}>
          <View style={styles.stepIcon}>
            <LogOut size={20} color="#EF4444" />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>User Initiates Sign-Out</Text>
            <Text style={styles.stepDescription}>
              User taps "Sign Out" button in Profile → Settings
            </Text>
          </View>
        </View>

        <ArrowDown size={20} color="#6B7280" style={styles.arrow} />

        <View style={styles.flowStep}>
          <View style={styles.stepIcon}>
            <Shield size={20} color="#F59E0B" />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Confirmation Dialog</Text>
            <Text style={styles.stepDescription}>
              System displays confirmation: "Are you sure you want to sign out? You will need to sign in again to access your account."
            </Text>
          </View>
        </View>

        <ArrowDown size={20} color="#6B7280" style={styles.arrow} />

        <View style={styles.flowStep}>
          <View style={styles.stepIcon}>
            <CheckCircle size={20} color="#10B981" />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Session Cleanup</Text>
            <Text style={styles.stepDescription}>
              • Clear authentication tokens{'\n'}
              • Remove cached user data{'\n'}
              • Reset app state{'\n'}
              • Clear sensitive information
            </Text>
          </View>
        </View>

        <ArrowDown size={20} color="#6B7280" style={styles.arrow} />

        <View style={styles.flowStep}>
          <View style={styles.stepIcon}>
            <ArrowRight size={20} color="#2563EB" />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Redirect to Login</Text>
            <Text style={styles.stepDescription}>
              Navigate user to Login screen with success confirmation
            </Text>
          </View>
        </View>
      </View>

      {/* Login Flow */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Login Page Design</Text>
        
        <View style={styles.designSpec}>
          <Text style={styles.specTitle}>Visual Hierarchy</Text>
          <View style={styles.specList}>
            <Text style={styles.specItem}>• TripSee logo with suitcase + pin icon at top center</Text>
            <Text style={styles.specItem}>• App name "TripSee" with tagline "Plan. Explore. Remember."</Text>
            <Text style={styles.specItem}>• Welcome message with clear value proposition</Text>
            <Text style={styles.specItem}>• Authentication options in order of prominence</Text>
          </View>
        </View>

        <View style={styles.designSpec}>
          <Text style={styles.specTitle}>Authentication Methods (Priority Order)</Text>
          <View style={styles.authMethod}>
            <Text style={styles.authTitle}>1. Google Login (Primary)</Text>
            <Text style={styles.authDescription}>
              • Official Google branding with logo{'\n'}
              • "Continue with Google" text{'\n'}
              • Prominent button styling with shadow
            </Text>
          </View>
          
          <View style={styles.authMethod}>
            <Text style={styles.authTitle}>2. Guest Access (Secondary)</Text>
            <Text style={styles.authDescription}>
              • "Continue as Guest" with user icon{'\n'}
              • Secondary visual treatment{'\n'}
              • Opens guest registration modal
            </Text>
          </View>
          
          <View style={styles.authMethod}>
            <Text style={styles.authTitle}>3. Email/Password (Traditional)</Text>
            <Text style={styles.authDescription}>
              • Standard form fields with validation{'\n'}
              • "Forgot Password?" link{'\n'}
              • Loading states and error handling
            </Text>
          </View>
        </View>
      </View>

      {/* Guest Flow Specifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Guest Login Specifications</Text>
        
        <View style={styles.guestSpec}>
          <Text style={styles.specTitle}>Modal Form Fields</Text>
          <View style={styles.fieldSpec}>
            <Text style={styles.fieldTitle}>Full Name *</Text>
            <Text style={styles.fieldDescription}>
              • 2-50 character limit{'\n'}
              • Letters, spaces, hyphens, apostrophes only{'\n'}
              • Real-time character counter{'\n'}
              • Inline validation with error messages
            </Text>
          </View>
          
          <View style={styles.fieldSpec}>
            <Text style={styles.fieldTitle}>Email Address *</Text>
            <Text style={styles.fieldDescription}>
              • Standard email format validation{'\n'}
              • Real-time validation feedback{'\n'}
              • Clear error messaging{'\n'}
              • Email icon for visual clarity
            </Text>
          </View>
        </View>

        <View style={styles.guestSpec}>
          <Text style={styles.specTitle}>Limitations Notice</Text>
          <View style={styles.limitationsBox}>
            <Text style={styles.limitationsTitle}>Guest User Limitations:</Text>
            <Text style={styles.limitationsText}>
              • Cannot save trips or favorites{'\n'}
              • Limited access to social features{'\n'}
              • No expense tracking or collaboration{'\n'}
              • Data not synced across devices
            </Text>
            <Text style={styles.upgradeText}>
              Create an account anytime to unlock all features!
            </Text>
          </View>
        </View>
      </View>

      {/* Technical Implementation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Technical Implementation</Text>
        
        <View style={styles.techSpec}>
          <Text style={styles.specTitle}>Security Requirements</Text>
          <Text style={styles.techItem}>• HTTPS for all authentication requests</Text>
          <Text style={styles.techItem}>• Secure token storage using platform keychain</Text>
          <Text style={styles.techItem}>• Session timeout handling (30 minutes inactive)</Text>
          <Text style={styles.techItem}>• Biometric authentication support (future)</Text>
        </View>

        <View style={styles.techSpec}>
          <Text style={styles.specTitle}>Loading States</Text>
          <Text style={styles.techItem}>• Button loading indicators with spinner</Text>
          <Text style={styles.techItem}>• Disabled state styling during requests</Text>
          <Text style={styles.techItem}>• Form validation before submission</Text>
          <Text style={styles.techItem}>• Error handling with user-friendly messages</Text>
        </View>

        <View style={styles.techSpec}>
          <Text style={styles.specTitle}>Analytics Tracking</Text>
          <Text style={styles.techItem}>• Authentication method usage</Text>
          <Text style={styles.techItem}>• Guest conversion rates</Text>
          <Text style={styles.techItem}>• Login success/failure rates</Text>
          <Text style={styles.techItem}>• User journey completion</Text>
        </View>
      </View>

      {/* Accessibility Standards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Accessibility Standards</Text>
        
        <View style={styles.a11ySpec}>
          <Text style={styles.specTitle}>WCAG AA Compliance</Text>
          <Text style={styles.a11yItem}>• 4.5:1 contrast ratio for all text</Text>
          <Text style={styles.a11yItem}>• 44pt minimum touch target size</Text>
          <Text style={styles.a11yItem}>• Screen reader compatibility</Text>
          <Text style={styles.a11yItem}>• Keyboard navigation support</Text>
          <Text style={styles.a11yItem}>• Focus indicators for all interactive elements</Text>
          <Text style={styles.a11yItem}>• Semantic HTML structure</Text>
          <Text style={styles.a11yItem}>• Alt text for all images and icons</Text>
          <Text style={styles.a11yItem}>• Voice-over announcements for errors</Text>
        </View>
      </View>

      {/* Design System */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Design System Integration</Text>
        
        <View style={styles.designSystemSpec}>
          <Text style={styles.specTitle}>Color Palette</Text>
          <View style={styles.colorRow}>
            <View style={[styles.colorSwatch, { backgroundColor: '#2563EB' }]} />
            <Text style={styles.colorLabel}>Primary Blue (#2563EB)</Text>
          </View>
          <View style={styles.colorRow}>
            <View style={[styles.colorSwatch, { backgroundColor: '#6B7280' }]} />
            <Text style={styles.colorLabel}>Secondary Gray (#6B7280)</Text>
          </View>
          <View style={styles.colorRow}>
            <View style={[styles.colorSwatch, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.colorLabel}>Error Red (#EF4444)</Text>
          </View>
          <View style={styles.colorRow}>
            <View style={[styles.colorSwatch, { backgroundColor: '#10B981' }]} />
            <Text style={styles.colorLabel}>Success Green (#10B981)</Text>
          </View>
        </View>

        <View style={styles.designSystemSpec}>
          <Text style={styles.specTitle}>Typography Scale</Text>
          <Text style={styles.typeItem}>• App Name: 32px, Bold (-0.5 letter-spacing)</Text>
          <Text style={styles.typeItem}>• Page Title: 24px, Semibold</Text>
          <Text style={styles.typeItem}>• Section Title: 20px, Semibold</Text>
          <Text style={styles.typeItem}>• Body Text: 16px, Regular</Text>
          <Text style={styles.typeItem}>• Caption: 14px, Medium</Text>
          <Text style={styles.typeItem}>• Small Text: 12px, Regular</Text>
        </View>

        <View style={styles.designSystemSpec}>
          <Text style={styles.specTitle}>Spacing System (8px Grid)</Text>
          <Text style={styles.spaceItem}>• Component padding: 16px, 20px</Text>
          <Text style={styles.spaceItem}>• Section margins: 24px, 32px</Text>
          <Text style={styles.spaceItem}>• Element spacing: 8px, 12px</Text>
          <Text style={styles.spaceItem}>• Touch targets: 44px minimum</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  flowStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  arrow: {
    alignSelf: 'center',
    marginVertical: 8,
  },
  designSpec: {
    marginBottom: 20,
  },
  specTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  specList: {
    marginLeft: 8,
  },
  specItem: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 4,
  },
  authMethod: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  authTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  authDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  guestSpec: {
    marginBottom: 20,
  },
  fieldSpec: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fieldTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  fieldDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  limitationsBox: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  limitationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  limitationsText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
    marginBottom: 12,
  },
  upgradeText: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '500',
    textAlign: 'center',
  },
  techSpec: {
    marginBottom: 16,
  },
  techItem: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 4,
    marginLeft: 8,
  },
  a11ySpec: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  a11yItem: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 4,
    marginLeft: 8,
  },
  designSystemSpec: {
    marginBottom: 20,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorSwatch: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  colorLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  typeItem: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 4,
    marginLeft: 8,
  },
  spaceItem: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 4,
    marginLeft: 8,
  },
});