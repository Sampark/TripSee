import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ArrowRight, ArrowDown, User, Shield, LogOut, Check, Mail, Lock, Eye, Luggage, MapPin, Smartphone, Monitor, Palette, Type, Grid2x2 as Grid, Accessibility, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';

/**
 * TripSee Authentication Flow Design System
 * 
 * Comprehensive UI/UX documentation and wireframes for the authentication flow
 * including sign-out process, login page design, and guest access functionality.
 */

export default function TripSeeAuthDesignSystem() {
  const [activeSection, setActiveSection] = useState('overview');
  const { width } = Dimensions.get('window');
  const isTablet = width > 768;

  const sections = [
    { id: 'overview', title: 'Overview', icon: <Grid size={20} color="#2563EB" /> },
    { id: 'userflow', title: 'User Flow', icon: <ArrowRight size={20} color="#2563EB" /> },
    { id: 'wireframes', title: 'Wireframes', icon: <Smartphone size={20} color="#2563EB" /> },
    { id: 'components', title: 'Components', icon: <Type size={20} color="#2563EB" /> },
    { id: 'accessibility', title: 'Accessibility', icon: <Accessibility size={20} color="#2563EB" /> },
    { id: 'implementation', title: 'Implementation', icon: <Monitor size={20} color="#2563EB" /> },
  ];

  const renderNavigation = () => (
    <View style={styles.navigation}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={[
              styles.navItem,
              activeSection === section.id && styles.navItemActive
            ]}
            onPress={() => setActiveSection(section.id)}
          >
            {section.icon}
            <Text style={[
              styles.navText,
              activeSection === section.id && styles.navTextActive
            ]}>
              {section.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderOverview = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>TripSee Authentication Design System</Text>
      
      <View style={styles.overviewCard}>
        <View style={styles.logoPreview}>
          <View style={styles.logoContainer}>
            <Luggage size={32} color="#FFFFFF" />
            <MapPin size={24} color="#FFFFFF" style={styles.logoPin} />
          </View>
          <Text style={styles.logoText}>TripSee</Text>
          <Text style={styles.logoTagline}>Plan. Explore. Remember.</Text>
        </View>
      </View>

      <View style={styles.objectivesCard}>
        <Text style={styles.cardTitle}>Design Objectives</Text>
        <View style={styles.objectivesList}>
          <View style={styles.objectiveItem}>
            <CheckCircle size={16} color="#10B981" />
            <Text style={styles.objectiveText}>Streamlined authentication with multiple options</Text>
          </View>
          <View style={styles.objectiveItem}>
            <CheckCircle size={16} color="#10B981" />
            <Text style={styles.objectiveText}>Guest access for immediate app exploration</Text>
          </View>
          <View style={styles.objectiveItem}>
            <CheckCircle size={16} color="#10B981" />
            <Text style={styles.objectiveText}>Secure session management and data protection</Text>
          </View>
          <View style={styles.objectiveItem}>
            <CheckCircle size={16} color="#10B981" />
            <Text style={styles.objectiveText}>WCAG AA accessibility compliance</Text>
          </View>
        </View>
      </View>

      <View style={styles.keyFeaturesCard}>
        <Text style={styles.cardTitle}>Key Features</Text>
        <View style={styles.featureGrid}>
          <View style={styles.featureItem}>
            <Shield size={24} color="#2563EB" />
            <Text style={styles.featureTitle}>Secure Authentication</Text>
            <Text style={styles.featureDescription}>Multi-factor authentication with secure token storage</Text>
          </View>
          <View style={styles.featureItem}>
            <User size={24} color="#10B981" />
            <Text style={styles.featureTitle}>Guest Access</Text>
            <Text style={styles.featureDescription}>Immediate app exploration without registration</Text>
          </View>
          <View style={styles.featureItem}>
            <Palette size={24} color="#F59E0B" />
            <Text style={styles.featureTitle}>Consistent Design</Text>
            <Text style={styles.featureDescription}>Unified visual language across all screens</Text>
          </View>
          <View style={styles.featureItem}>
            <Accessibility size={24} color="#8B5CF6" />
            <Text style={styles.featureTitle}>Universal Access</Text>
            <Text style={styles.featureDescription}>Screen reader support and keyboard navigation</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderUserFlow = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Authentication User Flow</Text>
      
      {/* Sign-Out Flow */}
      <View style={styles.flowCard}>
        <Text style={styles.flowTitle}>1. Sign-Out Process</Text>
        
        <View style={styles.flowStep}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>User Initiates Sign-Out</Text>
            <Text style={styles.stepDescription}>
              User navigates to Profile → Settings and taps "Sign Out" button
            </Text>
            <View style={styles.stepDetails}>
              <Text style={styles.detailItem}>• Location: Profile tab → Settings section</Text>
              <Text style={styles.detailItem}>• Trigger: Red "Sign Out" button with logout icon</Text>
              <Text style={styles.detailItem}>• Visual: Destructive action styling</Text>
            </View>
          </View>
        </View>

        <ArrowDown size={20} color="#6B7280" style={styles.flowArrow} />

        <View style={styles.flowStep}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Confirmation Dialog</Text>
            <Text style={styles.stepDescription}>
              System displays security confirmation dialog
            </Text>
            <View style={styles.confirmationPreview}>
              <Text style={styles.confirmationTitle}>Sign Out</Text>
              <Text style={styles.confirmationMessage}>
                Are you sure you want to sign out? You will need to sign in again to access your account.
              </Text>
              <View style={styles.confirmationButtons}>
                <View style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </View>
                <View style={styles.confirmButton}>
                  <Text style={styles.confirmButtonText}>Sign Out</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <ArrowDown size={20} color="#6B7280" style={styles.flowArrow} />

        <View style={styles.flowStep}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Session Cleanup</Text>
            <Text style={styles.stepDescription}>
              System performs secure data cleanup
            </Text>
            <View style={styles.cleanupList}>
              <View style={styles.cleanupItem}>
                <XCircle size={16} color="#EF4444" />
                <Text style={styles.cleanupText}>Clear authentication tokens</Text>
              </View>
              <View style={styles.cleanupItem}>
                <XCircle size={16} color="#EF4444" />
                <Text style={styles.cleanupText}>Remove cached user data</Text>
              </View>
              <View style={styles.cleanupItem}>
                <XCircle size={16} color="#EF4444" />
                <Text style={styles.cleanupText}>Reset application state</Text>
              </View>
              <View style={styles.cleanupItem}>
                <XCircle size={16} color="#EF4444" />
                <Text style={styles.cleanupText}>Clear sensitive information</Text>
              </View>
            </View>
          </View>
        </View>

        <ArrowDown size={20} color="#6B7280" style={styles.flowArrow} />

        <View style={styles.flowStep}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>4</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Redirect to Login</Text>
            <Text style={styles.stepDescription}>
              Navigate to Login screen with success confirmation
            </Text>
            <View style={styles.successMessage}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.successText}>Successfully signed out</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Login Flow */}
      <View style={styles.flowCard}>
        <Text style={styles.flowTitle}>2. Login Authentication Flow</Text>
        
        <View style={styles.authMethodsFlow}>
          <View style={styles.authMethod}>
            <View style={styles.authIcon}>
              <Text style={styles.googleG}>G</Text>
            </View>
            <Text style={styles.authTitle}>Google OAuth</Text>
            <Text style={styles.authDescription}>Primary authentication method</Text>
          </View>
          
          <View style={styles.authMethod}>
            <View style={[styles.authIcon, { backgroundColor: '#6B7280' }]}>
              <User size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.authTitle}>Guest Access</Text>
            <Text style={styles.authDescription}>Quick exploration mode</Text>
          </View>
          
          <View style={styles.authMethod}>
            <View style={[styles.authIcon, { backgroundColor: '#374151' }]}>
              <Mail size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.authTitle}>Email/Password</Text>
            <Text style={styles.authDescription}>Traditional authentication</Text>
          </View>
        </View>
      </View>

      {/* Guest Flow */}
      <View style={styles.flowCard}>
        <Text style={styles.flowTitle}>3. Guest Registration Flow</Text>
        
        <View style={styles.guestFlowSteps}>
          <View style={styles.guestStep}>
            <Text style={styles.guestStepTitle}>Modal Presentation</Text>
            <Text style={styles.guestStepDesc}>Slide-up modal with guest registration form</Text>
          </View>
          
          <ArrowRight size={16} color="#6B7280" style={styles.guestArrow} />
          
          <View style={styles.guestStep}>
            <Text style={styles.guestStepTitle}>Form Validation</Text>
            <Text style={styles.guestStepDesc}>Real-time validation with error feedback</Text>
          </View>
          
          <ArrowRight size={16} color="#6B7280" style={styles.guestArrow} />
          
          <View style={styles.guestStep}>
            <Text style={styles.guestStepTitle}>Session Creation</Text>
            <Text style={styles.guestStepDesc}>Limited session with feature restrictions</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderWireframes = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Screen Wireframes</Text>
      
      {/* Login Screen Wireframe */}
      <View style={styles.wireframeCard}>
        <Text style={styles.wireframeTitle}>Login Screen Layout</Text>
        
        <View style={styles.phoneFrame}>
          <View style={styles.phoneScreen}>
            {/* Header */}
            <View style={styles.wireframeHeader}>
              <View style={styles.logoWireframe}>
                <Luggage size={24} color="#2563EB" />
                <MapPin size={16} color="#2563EB" style={styles.logoPin} />
              </View>
              <Text style={styles.wireframeAppName}>TripSee</Text>
              <Text style={styles.wireframeTagline}>Plan. Explore. Remember.</Text>
            </View>
            
            {/* Welcome Section */}
            <View style={styles.wireframeWelcome}>
              <Text style={styles.wireframeWelcomeTitle}>Welcome Back</Text>
              <Text style={styles.wireframeWelcomeText}>
                Sign in to access your trips and continue planning
              </Text>
            </View>
            
            {/* Auth Buttons */}
            <View style={styles.wireframeAuth}>
              <View style={styles.wireframeButton}>
                <Text style={styles.wireframeButtonText}>Continue with Google</Text>
              </View>
              <View style={[styles.wireframeButton, styles.wireframeButtonSecondary]}>
                <Text style={styles.wireframeButtonTextSecondary}>Continue as Guest</Text>
              </View>
              
              <View style={styles.wireframeDivider}>
                <View style={styles.wireframeDividerLine} />
                <Text style={styles.wireframeDividerText}>or sign in with email</Text>
                <View style={styles.wireframeDividerLine} />
              </View>
              
              <View style={styles.wireframeForm}>
                <View style={styles.wireframeInput}>
                  <Text style={styles.wireframeInputLabel}>Email</Text>
                </View>
                <View style={styles.wireframeInput}>
                  <Text style={styles.wireframeInputLabel}>Password</Text>
                </View>
                <View style={styles.wireframeButton}>
                  <Text style={styles.wireframeButtonText}>Sign In</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.wireframeAnnotations}>
          <Text style={styles.annotationTitle}>Design Annotations</Text>
          <View style={styles.annotation}>
            <View style={styles.annotationDot} />
            <Text style={styles.annotationText}>Logo positioned at top center with 40px top margin</Text>
          </View>
          <View style={styles.annotation}>
            <View style={styles.annotationDot} />
            <Text style={styles.annotationText}>Google button uses official branding with 2px border</Text>
          </View>
          <View style={styles.annotation}>
            <View style={styles.annotationDot} />
            <Text style={styles.annotationText}>Guest button has secondary styling with user icon</Text>
          </View>
          <View style={styles.annotation}>
            <View style={styles.annotationDot} />
            <Text style={styles.annotationText}>Form inputs have 16px padding and rounded corners</Text>
          </View>
        </View>
      </View>

      {/* Guest Modal Wireframe */}
      <View style={styles.wireframeCard}>
        <Text style={styles.wireframeTitle}>Guest Registration Modal</Text>
        
        <View style={styles.phoneFrame}>
          <View style={styles.phoneScreen}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalCancel}>Cancel</Text>
              <Text style={styles.modalTitle}>Continue as Guest</Text>
              <View style={{ width: 50 }} />
            </View>
            
            <View style={styles.modalContent}>
              <View style={styles.guestIntro}>
                <View style={styles.guestIcon}>
                  <User size={24} color="#2563EB" />
                </View>
                <Text style={styles.guestIntroTitle}>Quick Access</Text>
                <Text style={styles.guestIntroText}>
                  Get started immediately with guest access
                </Text>
              </View>
              
              <View style={styles.guestForm}>
                <View style={styles.wireframeInput}>
                  <Text style={styles.wireframeInputLabel}>Full Name *</Text>
                  <Text style={styles.characterCounter}>0/50</Text>
                </View>
                <View style={styles.wireframeInput}>
                  <Text style={styles.wireframeInputLabel}>Email Address *</Text>
                </View>
                <View style={[styles.wireframeButton, styles.disabledButton]}>
                  <Text style={styles.disabledButtonText}>Continue as Guest</Text>
                </View>
              </View>
              
              <View style={styles.limitationsBox}>
                <Text style={styles.limitationsTitle}>Guest User Limitations</Text>
                <Text style={styles.limitationsText}>
                  • Cannot save trips or favorites{'\n'}
                  • Limited social features{'\n'}
                  • No expense tracking{'\n'}
                  • Data not synced
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderComponents = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Component Specifications</Text>
      
      {/* Color System */}
      <View style={styles.componentCard}>
        <Text style={styles.componentTitle}>Color System</Text>
        
        <View style={styles.colorGrid}>
          <View style={styles.colorItem}>
            <View style={[styles.colorSwatch, { backgroundColor: '#2563EB' }]} />
            <Text style={styles.colorName}>Primary Blue</Text>
            <Text style={styles.colorCode}>#2563EB</Text>
            <Text style={styles.colorUsage}>Buttons, links, focus states</Text>
          </View>
          
          <View style={styles.colorItem}>
            <View style={[styles.colorSwatch, { backgroundColor: '#6B7280' }]} />
            <Text style={styles.colorName}>Secondary Gray</Text>
            <Text style={styles.colorCode}>#6B7280</Text>
            <Text style={styles.colorUsage}>Secondary text, icons</Text>
          </View>
          
          <View style={styles.colorItem}>
            <View style={[styles.colorSwatch, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.colorName}>Error Red</Text>
            <Text style={styles.colorCode}>#EF4444</Text>
            <Text style={styles.colorUsage}>Error states, destructive actions</Text>
          </View>
          
          <View style={styles.colorItem}>
            <View style={[styles.colorSwatch, { backgroundColor: '#10B981' }]} />
            <Text style={styles.colorName}>Success Green</Text>
            <Text style={styles.colorCode}>#10B981</Text>
            <Text style={styles.colorUsage}>Success states, confirmations</Text>
          </View>
          
          <View style={styles.colorItem}>
            <View style={[styles.colorSwatch, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.colorName}>Warning Orange</Text>
            <Text style={styles.colorCode}>#F59E0B</Text>
            <Text style={styles.colorUsage}>Warnings, guest limitations</Text>
          </View>
          
          <View style={styles.colorItem}>
            <View style={[styles.colorSwatch, { backgroundColor: '#F9FAFB' }]} />
            <Text style={styles.colorName}>Background Gray</Text>
            <Text style={styles.colorCode}>#F9FAFB</Text>
            <Text style={styles.colorUsage}>Page backgrounds, cards</Text>
          </View>
        </View>
      </View>

      {/* Typography Scale */}
      <View style={styles.componentCard}>
        <Text style={styles.componentTitle}>Typography Scale</Text>
        
        <View style={styles.typographyList}>
          <View style={styles.typographyItem}>
            <Text style={[styles.typographyExample, { fontSize: 32, fontWeight: '700' }]}>
              TripSee
            </Text>
            <View style={styles.typographySpecs}>
              <Text style={styles.typographyLabel}>App Name</Text>
              <Text style={styles.typographyDetails}>32px • Bold • -0.5 letter-spacing</Text>
            </View>
          </View>
          
          <View style={styles.typographyItem}>
            <Text style={[styles.typographyExample, { fontSize: 24, fontWeight: '600' }]}>
              Welcome Back
            </Text>
            <View style={styles.typographySpecs}>
              <Text style={styles.typographyLabel}>Page Title</Text>
              <Text style={styles.typographyDetails}>24px • Semibold</Text>
            </View>
          </View>
          
          <View style={styles.typographyItem}>
            <Text style={[styles.typographyExample, { fontSize: 18, fontWeight: '600' }]}>
              Section Heading
            </Text>
            <View style={styles.typographySpecs}>
              <Text style={styles.typographyLabel}>Section Title</Text>
              <Text style={styles.typographyDetails}>18px • Semibold</Text>
            </View>
          </View>
          
          <View style={styles.typographyItem}>
            <Text style={[styles.typographyExample, { fontSize: 16, fontWeight: '400' }]}>
              Body text for descriptions and content
            </Text>
            <View style={styles.typographySpecs}>
              <Text style={styles.typographyLabel}>Body Text</Text>
              <Text style={styles.typographyDetails}>16px • Regular • 24px line-height</Text>
            </View>
          </View>
          
          <View style={styles.typographyItem}>
            <Text style={[styles.typographyExample, { fontSize: 14, fontWeight: '500' }]}>
              Button Text
            </Text>
            <View style={styles.typographySpecs}>
              <Text style={styles.typographyLabel}>Button Label</Text>
              <Text style={styles.typographyDetails}>14px • Medium</Text>
            </View>
          </View>
          
          <View style={styles.typographyItem}>
            <Text style={[styles.typographyExample, { fontSize: 12, fontWeight: '400' }]}>
              Caption and helper text
            </Text>
            <View style={styles.typographySpecs}>
              <Text style={styles.typographyLabel}>Caption</Text>
              <Text style={styles.typographyDetails}>12px • Regular</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Button Specifications */}
      <View style={styles.componentCard}>
        <Text style={styles.componentTitle}>Button Components</Text>
        
        <View style={styles.buttonSpecs}>
          <View style={styles.buttonExample}>
            <View style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Continue with Google</Text>
            </View>
            <View style={styles.buttonDetails}>
              <Text style={styles.buttonLabel}>Primary Button</Text>
              <Text style={styles.buttonSpecs}>• 16px vertical padding</Text>
              <Text style={styles.buttonSpecs}>• 12px border radius</Text>
              <Text style={styles.buttonSpecs}>• 2px border with shadow</Text>
              <Text style={styles.buttonSpecs}>• 44px minimum touch target</Text>
            </View>
          </View>
          
          <View style={styles.buttonExample}>
            <View style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Continue as Guest</Text>
            </View>
            <View style={styles.buttonDetails}>
              <Text style={styles.buttonLabel}>Secondary Button</Text>
              <Text style={styles.buttonSpecs}>• 16px vertical padding</Text>
              <Text style={styles.buttonSpecs}>• 12px border radius</Text>
              <Text style={styles.buttonSpecs}>• 1px border, no shadow</Text>
              <Text style={styles.buttonSpecs}>• Gray background</Text>
            </View>
          </View>
          
          <View style={styles.buttonExample}>
            <View style={styles.disabledButtonExample}>
              <Text style={styles.disabledButtonTextExample}>Disabled State</Text>
            </View>
            <View style={styles.buttonDetails}>
              <Text style={styles.buttonLabel}>Disabled State</Text>
              <Text style={styles.buttonSpecs}>• 60% opacity</Text>
              <Text style={styles.buttonSpecs}>• No interaction feedback</Text>
              <Text style={styles.buttonSpecs}>• Loading spinner when processing</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderAccessibility = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Accessibility Guidelines</Text>
      
      {/* WCAG Compliance */}
      <View style={styles.accessibilityCard}>
        <Text style={styles.accessibilityTitle}>WCAG AA Compliance</Text>
        
        <View style={styles.complianceGrid}>
          <View style={styles.complianceItem}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.complianceText}>4.5:1 contrast ratio for all text</Text>
          </View>
          <View style={styles.complianceItem}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.complianceText}>44pt minimum touch target size</Text>
          </View>
          <View style={styles.complianceItem}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.complianceText}>Screen reader compatibility</Text>
          </View>
          <View style={styles.complianceItem}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.complianceText}>Keyboard navigation support</Text>
          </View>
          <View style={styles.complianceItem}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.complianceText}>Focus indicators for all elements</Text>
          </View>
          <View style={styles.complianceItem}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.complianceText}>Semantic HTML structure</Text>
          </View>
        </View>
      </View>

      {/* Screen Reader Support */}
      <View style={styles.accessibilityCard}>
        <Text style={styles.accessibilityTitle}>Screen Reader Implementation</Text>
        
        <View style={styles.screenReaderSpecs}>
          <View style={styles.srSpec}>
            <Text style={styles.srLabel}>Login Button</Text>
            <Text style={styles.srCode}>accessibilityLabel="Sign in with Google"</Text>
            <Text style={styles.srCode}>accessibilityHint="Tap to authenticate using Google account"</Text>
          </View>
          
          <View style={styles.srSpec}>
            <Text style={styles.srLabel}>Form Inputs</Text>
            <Text style={styles.srCode}>accessibilityLabel="Email address input"</Text>
            <Text style={styles.srCode}>accessibilityHint="Enter your email to sign in"</Text>
          </View>
          
          <View style={styles.srSpec}>
            <Text style={styles.srLabel}>Error States</Text>
            <Text style={styles.srCode}>accessibilityLiveRegion="polite"</Text>
            <Text style={styles.srCode}>Announces validation errors immediately</Text>
          </View>
        </View>
      </View>

      {/* Keyboard Navigation */}
      <View style={styles.accessibilityCard}>
        <Text style={styles.accessibilityTitle}>Keyboard Navigation Flow</Text>
        
        <View style={styles.keyboardFlow}>
          <View style={styles.keyboardStep}>
            <Text style={styles.keyboardStepNumber}>1</Text>
            <Text style={styles.keyboardStepText}>Tab to Google login button</Text>
          </View>
          <ArrowDown size={16} color="#6B7280" />
          <View style={styles.keyboardStep}>
            <Text style={styles.keyboardStepNumber}>2</Text>
            <Text style={styles.keyboardStepText}>Tab to Guest access button</Text>
          </View>
          <ArrowDown size={16} color="#6B7280" />
          <View style={styles.keyboardStep}>
            <Text style={styles.keyboardStepNumber}>3</Text>
            <Text style={styles.keyboardStepText}>Tab to email input field</Text>
          </View>
          <ArrowDown size={16} color="#6B7280" />
          <View style={styles.keyboardStep}>
            <Text style={styles.keyboardStepNumber}>4</Text>
            <Text style={styles.keyboardStepText}>Tab to password input field</Text>
          </View>
          <ArrowDown size={16} color="#6B7280" />
          <View style={styles.keyboardStep}>
            <Text style={styles.keyboardStepNumber}>5</Text>
            <Text style={styles.keyboardStepText}>Tab to sign in button</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderImplementation = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Implementation Guide</Text>
      
      {/* Technical Requirements */}
      <View style={styles.implementationCard}>
        <Text style={styles.implementationTitle}>Technical Requirements</Text>
        
        <View style={styles.requirementsList}>
          <View style={styles.requirementCategory}>
            <Text style={styles.categoryTitle}>Security</Text>
            <View style={styles.requirementItems}>
              <Text style={styles.requirementItem}>• HTTPS for all authentication requests</Text>
              <Text style={styles.requirementItem}>• Secure token storage using platform keychain</Text>
              <Text style={styles.requirementItem}>• Session timeout handling (30 minutes inactive)</Text>
              <Text style={styles.requirementItem}>• Biometric authentication support (future)</Text>
            </View>
          </View>
          
          <View style={styles.requirementCategory}>
            <Text style={styles.categoryTitle}>Performance</Text>
            <View style={styles.requirementItems}>
              <Text style={styles.requirementItem}>• Loading states with progress indicators</Text>
              <Text style={styles.requirementItem}>• Form validation before submission</Text>
              <Text style={styles.requirementItem}>• Optimistic UI updates where appropriate</Text>
              <Text style={styles.requirementItem}>• Error handling with retry mechanisms</Text>
            </View>
          </View>
          
          <View style={styles.requirementCategory}>
            <Text style={styles.categoryTitle}>Analytics</Text>
            <View style={styles.requirementItems}>
              <Text style={styles.requirementItem}>• Authentication method usage tracking</Text>
              <Text style={styles.requirementItem}>• Guest conversion rate monitoring</Text>
              <Text style={styles.requirementItem}>• Login success/failure rate analysis</Text>
              <Text style={styles.requirementItem}>• User journey completion tracking</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Error Handling */}
      <View style={styles.implementationCard}>
        <Text style={styles.implementationTitle}>Error State Management</Text>
        
        <View style={styles.errorStates}>
          <View style={styles.errorState}>
            <AlertCircle size={20} color="#EF4444" />
            <View style={styles.errorContent}>
              <Text style={styles.errorTitle}>Network Error</Text>
              <Text style={styles.errorMessage}>
                "Unable to connect. Please check your internet connection and try again."
              </Text>
              <Text style={styles.errorAction}>Action: Show retry button</Text>
            </View>
          </View>
          
          <View style={styles.errorState}>
            <AlertCircle size={20} color="#EF4444" />
            <View style={styles.errorContent}>
              <Text style={styles.errorTitle}>Invalid Credentials</Text>
              <Text style={styles.errorMessage}>
                "Email or password is incorrect. Please try again."
              </Text>
              <Text style={styles.errorAction}>Action: Clear password field, focus email</Text>
            </View>
          </View>
          
          <View style={styles.errorState}>
            <AlertCircle size={20} color="#EF4444" />
            <View style={styles.errorContent}>
              <Text style={styles.errorTitle}>Account Locked</Text>
              <Text style={styles.errorMessage}>
                "Account temporarily locked due to multiple failed attempts."
              </Text>
              <Text style={styles.errorAction}>Action: Show forgot password option</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Platform Considerations */}
      <View style={styles.implementationCard}>
        <Text style={styles.implementationTitle}>Platform-Specific Considerations</Text>
        
        <View style={styles.platformGrid}>
          <View style={styles.platformCard}>
            <Text style={styles.platformTitle}>iOS</Text>
            <View style={styles.platformFeatures}>
              <Text style={styles.platformFeature}>• Face ID / Touch ID integration</Text>
              <Text style={styles.platformFeature}>• iOS keychain for secure storage</Text>
              <Text style={styles.platformFeature}>• Native modal presentation styles</Text>
              <Text style={styles.platformFeature}>• iOS-specific loading indicators</Text>
            </View>
          </View>
          
          <View style={styles.platformCard}>
            <Text style={styles.platformTitle}>Android</Text>
            <View style={styles.platformFeatures}>
              <Text style={styles.platformFeature}>• Fingerprint / Face unlock support</Text>
              <Text style={styles.platformFeature}>• Android keystore integration</Text>
              <Text style={styles.platformFeature}>• Material Design components</Text>
              <Text style={styles.platformFeature}>• Android-specific animations</Text>
            </View>
          </View>
          
          <View style={styles.platformCard}>
            <Text style={styles.platformTitle}>Web</Text>
            <View style={styles.platformFeatures}>
              <Text style={styles.platformFeature}>• Browser credential management</Text>
              <Text style={styles.platformFeature}>• Local storage for session data</Text>
              <Text style={styles.platformFeature}>• Responsive design breakpoints</Text>
              <Text style={styles.platformFeature}>• Progressive web app features</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Testing Checklist */}
      <View style={styles.implementationCard}>
        <Text style={styles.implementationTitle}>Testing Checklist</Text>
        
        <View style={styles.testingChecklist}>
          <View style={styles.testCategory}>
            <Text style={styles.testCategoryTitle}>Functional Testing</Text>
            <View style={styles.testItems}>
              <View style={styles.testItem}>
                <View style={styles.checkbox} />
                <Text style={styles.testText}>Google OAuth flow completes successfully</Text>
              </View>
              <View style={styles.testItem}>
                <View style={styles.checkbox} />
                <Text style={styles.testText}>Guest registration validates all fields</Text>
              </View>
              <View style={styles.testItem}>
                <View style={styles.checkbox} />
                <Text style={styles.testText}>Email/password authentication works</Text>
              </View>
              <View style={styles.testItem}>
                <View style={styles.checkbox} />
                <Text style={styles.testText}>Sign-out clears all session data</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.testCategory}>
            <Text style={styles.testCategoryTitle}>Accessibility Testing</Text>
            <View style={styles.testItems}>
              <View style={styles.testItem}>
                <View style={styles.checkbox} />
                <Text style={styles.testText}>Screen reader navigation works correctly</Text>
              </View>
              <View style={styles.testItem}>
                <View style={styles.checkbox} />
                <Text style={styles.testText}>Keyboard navigation follows logical order</Text>
              </View>
              <View style={styles.testItem}>
                <View style={styles.checkbox} />
                <Text style={styles.testText}>Color contrast meets WCAG AA standards</Text>
              </View>
              <View style={styles.testItem}>
                <View style={styles.checkbox} />
                <Text style={styles.testText}>Focus indicators are clearly visible</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'userflow': return renderUserFlow();
      case 'wireframes': return renderWireframes();
      case 'components': return renderComponents();
      case 'accessibility': return renderAccessibility();
      case 'implementation': return renderImplementation();
      default: return renderOverview();
    }
  };

  return (
    <View style={styles.container}>
      {renderNavigation()}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  navigation: {
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: '#EFF6FF',
  },
  navText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },
  navTextActive: {
    color: '#2563EB',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  
  // Overview Styles
  overviewCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  logoPreview: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  logoPin: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  logoTagline: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  objectivesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  objectivesList: {
    gap: 12,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  objectiveText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  keyFeaturesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  featureGrid: {
    gap: 16,
  },
  featureItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // User Flow Styles
  flowCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  flowTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
  },
  flowStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
    marginBottom: 8,
  },
  stepDetails: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  detailItem: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  flowArrow: {
    alignSelf: 'center',
    marginVertical: 12,
  },
  confirmationPreview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  confirmationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  confirmationMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  confirmationButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  cleanupList: {
    gap: 8,
  },
  cleanupItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cleanupText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 8,
  },
  successText: {
    fontSize: 14,
    color: '#065F46',
    marginLeft: 8,
    fontWeight: '500',
  },
  authMethodsFlow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  authMethod: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
  },
  authIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  googleG: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  authTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  authDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  guestFlowSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  guestStep: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
  },
  guestStepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  guestStepDesc: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  guestArrow: {
    marginHorizontal: 8,
  },
  
  // Wireframe Styles
  wireframeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  wireframeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
  },
  phoneFrame: {
    alignSelf: 'center',
    width: 300,
    height: 600,
    backgroundColor: '#000000',
    borderRadius: 24,
    padding: 4,
    marginBottom: 20,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  wireframeHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoWireframe: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  wireframeAppName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  wireframeTagline: {
    fontSize: 12,
    color: '#6B7280',
  },
  wireframeWelcome: {
    alignItems: 'center',
    marginBottom: 24,
  },
  wireframeWelcomeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  wireframeWelcomeText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  wireframeAuth: {
    gap: 12,
  },
  wireframeButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  wireframeButtonSecondary: {
    backgroundColor: '#F3F4F6',
  },
  wireframeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  wireframeButtonTextSecondary: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  wireframeDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  wireframeDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  wireframeDividerText: {
    fontSize: 10,
    color: '#6B7280',
    paddingHorizontal: 12,
  },
  wireframeForm: {
    gap: 12,
  },
  wireframeInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wireframeInputLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  characterCounter: {
    fontSize: 8,
    color: '#9CA3AF',
  },
  wireframeAnnotations: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
  },
  annotationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  annotation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  annotationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB',
    marginRight: 8,
  },
  annotationText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 16,
  },
  modalCancel: {
    fontSize: 12,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
  },
  guestIntro: {
    alignItems: 'center',
    marginBottom: 20,
  },
  guestIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  guestIntroTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  guestIntroText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  guestForm: {
    gap: 12,
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  disabledButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  limitationsBox: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  limitationsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 6,
  },
  limitationsText: {
    fontSize: 10,
    color: '#92400E',
    lineHeight: 14,
  },
  
  // Component Styles
  componentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  componentTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  colorItem: {
    width: '48%',
    alignItems: 'center',
  },
  colorSwatch: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  colorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  colorCode: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#6B7280',
    marginBottom: 4,
  },
  colorUsage: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  typographyList: {
    gap: 16,
  },
  typographyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  typographyExample: {
    flex: 1,
    color: '#111827',
  },
  typographySpecs: {
    width: 120,
  },
  typographyLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  typographyDetails: {
    fontSize: 10,
    color: '#6B7280',
  },
  buttonSpecs: {
    gap: 16,
  },
  buttonExample: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginRight: 16,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginRight: 16,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  disabledButtonExample: {
    backgroundColor: '#9CA3AF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginRight: 16,
    opacity: 0.6,
  },
  disabledButtonTextExample: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonDetails: {
    flex: 1,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  buttonSpecs: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  
  // Accessibility Styles
  accessibilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  accessibilityTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  complianceGrid: {
    gap: 12,
  },
  complianceItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  complianceText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
  },
  screenReaderSpecs: {
    gap: 16,
  },
  srSpec: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
  },
  srLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  srCode: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    padding: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  keyboardFlow: {
    alignItems: 'center',
    gap: 8,
  },
  keyboardStep: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  keyboardStepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  keyboardStepText: {
    fontSize: 14,
    color: '#374151',
  },
  
  // Implementation Styles
  implementationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  implementationTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  requirementsList: {
    gap: 20,
  },
  requirementCategory: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  requirementItems: {
    gap: 6,
  },
  requirementItem: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  errorStates: {
    gap: 16,
  },
  errorState: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorContent: {
    flex: 1,
    marginLeft: 12,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 12,
    color: '#7F1D1D',
    lineHeight: 16,
    marginBottom: 4,
  },
  errorAction: {
    fontSize: 10,
    color: '#991B1B',
    fontStyle: 'italic',
  },
  platformGrid: {
    gap: 16,
  },
  platformCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
  },
  platformTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  platformFeatures: {
    gap: 6,
  },
  platformFeature: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  testingChecklist: {
    gap: 20,
  },
  testCategory: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
  },
  testCategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  testItems: {
    gap: 8,
  },
  testItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 3,
    marginRight: 12,
  },
  testText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
});