# HAPI FHIR API Integration

This document describes the integration between the Healthcare Dashboard and the HAPI FHIR server.

## Overview

The dashboard now integrates with the HAPI FHIR server to provide real-time healthcare data including:

- Patient encounters
- Patient information
- Real-time metrics
- Interactive charts and visualizations
- Advanced filtering and search capabilities

## Configuration

### Environment Variables

Create a `.env.local` file in your project root with the following configuration:

```bash
# HAPI FHIR Server Configuration
NEXT_PUBLIC_FHIR_BASE_URL=https://hapi.fhir.org/baseR4

# Optional: API Key if required
# NEXT_PUBLIC_FHIR_API_KEY=your_api_key_here
```

### Default Configuration

If no environment variables are set, the system defaults to:

- **Base URL**: `https://hapi.fhir.org/baseR4`
- **API Key**: None (public server)

## Architecture

### 1. FHIR API Client (`src/infrastructure/api/fhir-api-client.ts`)

- Handles HTTP requests to the FHIR server
- Manages authentication and headers
- Provides error handling and response parsing

### 2. FHIR Service (`src/infrastructure/api/fhir-service.ts`)

- High-level service layer for dashboard operations
- Transforms FHIR data into dashboard-friendly formats
- Manages data aggregation and metrics calculation

### 3. React Query Integration (`src/infrastructure/queries/encounter-queries.ts`)

- Provides React hooks for data fetching
- Implements caching and real-time updates
- Manages loading states and error handling

### 4. State Management (`src/infrastructure/store/encounter-store.ts`)

- Centralized state management using Zustand
- Caches API responses for performance
- Manages pagination and filtering state

## Features

### Real-time Metrics

- Total encounters count
- Active encounters
- Daily averages
- Status distribution

### Interactive Charts

- **Status Distribution Chart**: Shows encounter distribution by status
- **Daily Trends Chart**: Displays daily encounter volume trends

### Advanced Filtering

- Status-based filtering
- Date range selection
- Patient search with autocomplete
- Practitioner search

### Data Management

- Automatic pagination
- Real-time data updates
- Optimistic updates
- Error handling and retry logic

## API Endpoints

The dashboard integrates with the following FHIR endpoints:

- `GET /Patient` - Search and retrieve patients
- `GET /Patient/{id}` - Get specific patient details
- `GET /Encounter` - Search and retrieve encounters
- `GET /Encounter/{id}` - Get specific encounter details

## Data Flow

1. **User Interaction**: User applies filters or navigates to dashboard
2. **Query Execution**: React Query triggers API calls
3. **API Request**: FHIR service makes requests to HAPI server
4. **Data Processing**: Raw FHIR data is transformed into dashboard format
5. **State Update**: Store is updated with new data
6. **UI Update**: Components re-render with fresh data

## Error Handling

The system includes comprehensive error handling:

- **Network Errors**: Automatic retry with exponential backoff
- **API Errors**: User-friendly error messages
- **Data Validation**: Fallback to cached data when possible
- **Loading States**: Skeleton loaders and progress indicators

## Performance Optimizations

- **Caching**: React Query provides intelligent caching
- **Pagination**: Large datasets are loaded incrementally
- **Debouncing**: Search inputs are debounced to reduce API calls
- **Optimistic Updates**: UI updates immediately while API calls complete

## Testing

The integration includes comprehensive testing:

- Unit tests for API clients
- Integration tests for services
- Component tests for UI elements
- Mock data for development

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the FHIR server allows cross-origin requests
2. **Rate Limiting**: Implement exponential backoff for failed requests
3. **Data Format**: Verify FHIR data conforms to expected schemas
4. **Authentication**: Check API key configuration if required

### Debug Mode

Enable debug logging by setting:

```bash
NODE_ENV=development
```

## Future Enhancements

- Real-time WebSocket connections
- Advanced analytics and reporting
- Bulk data operations
- Offline support with service workers
- Multi-tenant FHIR server support
