# TripSee Database Schema Documentation

## Overview

TripSee is a comprehensive travel planning and social platform that allows users to plan trips, manage expenses, discover places, and share experiences. The database schema is designed to support all the features found in the app's pages and components.

## Core Features Supported

### 1. **Trip Management** (Main Feature)
- Create, edit, and delete trips
- Trip collaboration with multiple users
- Trip invitations and role-based access
- Public and private trip visibility
- Trip sharing via unique share IDs

### 2. **User Management**
- Guest and authenticated user support
- User profiles with preferences
- User statistics and achievements
- Social connections (friends/followers)

### 3. **Place Discovery**
- Place categories and ratings
- Saved places functionality
- Place recommendations
- Integration with trips

### 4. **Expense Management**
- Expense tracking with categories
- Expense splitting between users
- Budget management per trip
- Expense settlements

### 5. **Social Features**
- Social posts sharing trips
- Likes and comments
- Public trip feed
- User connections

### 6. **Itinerary Planning** (Enhanced)
- Day-by-day itinerary creation with multiple item types
- Support for flights, trains, cabs, hotels, base locations, places, and other activities
- Multi-day item support (items spanning multiple days)
- Time-based scheduling and organization
- Status tracking (confirmed, pending, cancelled)

### 7. **Notifications**
- Real-time notifications
- Multiple notification types
- Read/unread status tracking

## Database Design Principles

### 1. **Scalability**
- Proper indexing on frequently queried columns
- JSON fields for flexible data storage
- Efficient foreign key relationships

### 2. **Data Integrity**
- Foreign key constraints with CASCADE/SET NULL
- Unique constraints where appropriate
- ENUM types for status fields

### 3. **Performance**
- Composite indexes for common query patterns
- Views for complex aggregations
- Stored procedures for common operations

### 4. **Flexibility**
- JSON fields for extensible data
- Optional fields for gradual feature adoption
- Support for both guest and authenticated users

## Key Tables and Relationships

### Core User Tables
```
users (1) ←→ (1) user_preferences
users (1) ←→ (1) user_stats
```

### Trip Management Tables
```
users (1) ←→ (many) trips
trips (1) ←→ (many) trip_collaborators
trips (1) ←→ (many) trip_invitations
trips (1) ←→ (many) trip_partners
trips (1) ←→ (many) fellow_travellers
```

### Places and Discovery
```
trips (1) ←→ (many) places
users (1) ←→ (many) places
```

### Expense Management
```
trips (1) ←→ (many) expenses
expenses (1) ←→ (many) expense_splits
users (1) ←→ (many) expense_settlements
```

### Social Features
```
trips (1) ←→ (many) social_posts
social_posts (1) ←→ (many) post_likes
social_posts (1) ←→ (many) post_comments
users (1) ←→ (many) user_connections
```

### Enhanced Itinerary Planning
```
trips (1) ←→ (many) itinerary_items
trips (1) ←→ (many) itinerary_day_plans
itinerary_day_plans (1) ←→ (many) itinerary_day_items
itinerary_items (1) ←→ (1) itinerary_day_items
```

## Detailed Table Descriptions

### Users Table
The central user table supporting both guest and authenticated users:
- **user_type**: Distinguishes between guest and authenticated users
- **is_active**: Tracks active sessions
- **preferred_currency**: User's default currency for expenses
- **last_active_at**: For session management

### Trips Table (Main Feature)
The core table for trip management:
- **visibility**: Public/private trip settings
- **share_id**: Unique identifier for trip sharing
- **destination_data**: JSON field for flexible destination information
- **currency**: Trip-specific currency for expenses

### Trip Collaboration System
Three levels of trip participation:
1. **trip_collaborators**: Registered users with roles (owner, admin, traveller, viewer)
2. **trip_partners**: Non-registered participants added by users
3. **fellow_travellers**: Additional participants for larger groups

### Enhanced Itinerary System
Comprehensive itinerary planning with support for multiple item types:

#### Itinerary Items Table
The main table for all itinerary items with type-specific fields:
- **type**: Item type (flight, train, cab, hotel, base, place, others)
- **name**: Item name/title
- **time**: Time of the item
- **location**: Location information
- **status**: Item status (confirmed, pending, cancelled)
- **is_multi_day**: Whether item spans multiple days
- **start_date/end_date**: For multi-day items

#### Type-Specific Fields
- **Flight items**: flight_number, departure_airport, arrival_airport, airline, departure_date, arrival_date
- **Train items**: train_number, departure_station, arrival_station, class, seat_number
- **Hotel items**: hotel_name, room_type, check_in_date, check_out_date, amenities, contact_person
- **Cab items**: cab_type, driver_name
- **Place items**: category, estimated_time, price, image, rating, description
- **Base location items**: accommodation_type

#### Itinerary Day Plans
Organizes items by day:
- **date**: The specific date
- **day_number**: Sequential day number
- **sort_order**: For ordering items within a day

### Expense Management
Comprehensive expense tracking with:
- **expenses**: Main expense records
- **expense_splits**: Who owes what for each expense
- **expense_settlements**: Payments between users
- **trip_budgets**: Budget limits per category per trip

### Social Features
Complete social platform with:
- **social_posts**: Shared trip posts
- **post_likes**: Like functionality
- **post_comments**: Comment system
- **user_connections**: Friend/follower relationships

## Performance Optimizations

### Indexes
- Primary keys on all tables
- Foreign key indexes for joins
- Composite indexes for common queries
- Status-based indexes for filtering
- Date range indexes for multi-day items

### Views
- **trip_summary**: Aggregated trip statistics
- **user_trip_stats**: User achievement statistics

### Stored Procedures
- **CreateTripWithOwner**: Atomic trip creation with owner assignment
- **SettleExpense**: Batch expense settlement

## Data Types and Constraints

### ENUM Types
- User types: `guest`, `authenticated`
- Trip visibility: `public`, `private`
- Collaboration roles: `owner`, `admin`, `traveller`, `viewer`
- Invitation status: `pending`, `accepted`, `declined`
- Expense settlement status: `pending`, `paid`, `received`
- Itinerary item types: `flight`, `train`, `cab`, `hotel`, `base`, `place`, `others`
- Item status: `confirmed`, `pending`, `cancelled`

### JSON Fields
- **destination_data**: Flexible destination information
- **travel_preferences**: User travel preferences
- **highlights**: Place highlights array
- **popular_with**: Place popularity data
- **notification data**: Additional notification context

### Currency Support
- **preferred_currency**: User's default currency
- **currency**: Trip-specific currency
- **exchange_rate**: For currency conversion

## Security Considerations

### Data Privacy
- **visibility**: Trip privacy controls
- **is_public**: Social post privacy
- **public_profile_enabled**: User profile privacy

### Access Control
- **role-based**: Collaboration roles
- **invitation system**: Controlled access
- **share tokens**: Secure sharing

## Scalability Features

### Horizontal Scaling
- UUID primary keys for distributed systems
- Timestamp-based ordering
- Stateless session management

### Vertical Scaling
- Efficient indexing strategy
- Normalized data structure
- Optimized query patterns

## Migration Strategy

### Version Control
- Timestamp-based versioning
- Backward compatibility considerations
- Gradual feature rollout support

### Data Migration
- JSON fields for flexible schema evolution
- Optional fields for gradual adoption
- Default values for new features

## Monitoring and Analytics

### Key Metrics
- User engagement (trips created, places saved)
- Social interaction (likes, comments, shares)
- Financial tracking (expenses, settlements)
- Performance metrics (query response times)
- Itinerary planning activity (items created, types used)

### Audit Trail
- **created_at/updated_at**: All tables
- **user tracking**: All user actions
- **status tracking**: State changes

## Future Considerations

### Potential Enhancements
- Real-time notifications (WebSocket support)
- Advanced analytics (data warehousing)
- Multi-language support (i18n)
- Advanced search (full-text search)
- Media management (image/video storage)
- Advanced itinerary features (recurring items, templates)

### Scalability Planning
- Read replicas for social features
- Caching strategy for discovery
- CDN integration for media
- Microservices architecture support

## Conclusion

This database schema provides a solid foundation for the TripSee app, supporting all current features while maintaining flexibility for future enhancements. The enhanced itinerary system now supports multiple item types and multi-day planning, making it more comprehensive for travel planning needs. The design prioritizes performance, scalability, and maintainability while ensuring data integrity and security. 