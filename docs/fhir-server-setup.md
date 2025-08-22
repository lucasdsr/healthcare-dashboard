# FHIR Server Setup Guide

This guide explains how to set up a real FHIR server and configure the Healthcare Dashboard to use it instead of the public HAPI FHIR test server.

## Why Use a Real FHIR Server?

The public HAPI FHIR server (`https://hapi.fhir.org/baseR4`) is a test server that:

- May have limited or no data
- Is shared by many users
- Has rate limiting
- Is not suitable for production use
- May be temporarily unavailable

## FHIR Server Options

### 1. HAPI FHIR (Self-Hosted)

**Best for: Development, Testing, Small Production**

```bash
# Using Docker
docker run -p 8080:8080 hapiproject/hapi:latest

# Using Maven
mvn jetty:run -Djetty.port=8080
```

**Configuration:**

```bash
NEXT_PUBLIC_FHIR_BASE_URL=http://localhost:8080/baseR4
```

### 2. Microsoft Azure Health Data Services

**Best for: Enterprise, Cloud-based**

```bash
# Create FHIR service in Azure Portal
# Enable CORS for your domain
# Get connection string from Azure
```

**Configuration:**

```bash
NEXT_PUBLIC_FHIR_BASE_URL=https://your-fhir-service.azurehealthcareapis.com
NEXT_PUBLIC_FHIR_API_KEY=your_access_token
```

### 3. AWS HealthLake

**Best for: AWS-based infrastructure**

```bash
# Create HealthLake FHIR store in AWS Console
# Configure CORS and authentication
# Get endpoint URL
```

**Configuration:**

```bash
NEXT_PUBLIC_FHIR_BASE_URL=https://your-healthlake-endpoint.amazonaws.com
NEXT_PUBLIC_FHIR_API_KEY=your_aws_credentials
```

### 4. Google Cloud Healthcare API

**Best for: Google Cloud users**

```bash
# Enable Healthcare API in Google Cloud
# Create FHIR store
# Configure authentication
```

**Configuration:**

```bash
NEXT_PUBLIC_FHIR_BASE_URL=https://healthcare.googleapis.com/v1/projects/your-project/locations/your-location/datasets/your-dataset/fhirStores/your-store/fhir
NEXT_PUBLIC_FHIR_API_KEY=your_google_credentials
```

## Local Development Setup

### Option 1: HAPI FHIR with Docker

```bash
# Create docker-compose.yml
version: '3.8'
services:
  hapi-fhir:
    image: hapiproject/hapi:latest
    ports:
      - "8080:8080"
    environment:
      - hapi.fhir.fhir_version=R4
      - hapi.fhir.allow_external_references=true
      - hapi.fhir.allow_placeholder_references=true
    volumes:
      - hapi-data:/data

volumes:
  hapi-data:
```

```bash
# Start the server
docker-compose up -d

# Check if it's running
curl http://localhost:8080/baseR4/metadata
```

### Option 2: HAPI FHIR with Maven

```bash
# Clone HAPI FHIR repository
git clone https://github.com/hapifhir/hapi-fhir.git
cd hapi-fhir/hapi-fhir-jpaserver-starter

# Run the server
mvn jetty:run -Djetty.port=8080
```

## Data Population

### 1. Upload Sample Data

```bash
# Using HAPI FHIR CLI
curl -X POST "http://localhost:8080/baseR4/Patient" \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Patient",
    "id": "patient-1",
    "name": [{"use": "official", "text": "John Smith"}],
    "gender": "male",
    "birthDate": "1990-01-01"
  }'
```

### 2. Use FHIR Test Data Generators

```bash
# Install FHIR test data generator
npm install -g fhir-test-data-generator

# Generate sample data
fhir-test-data-generator --count 100 --output patients.json
```

### 3. Import from CSV/Excel

```bash
# Convert your existing data to FHIR format
# Use tools like FHIR Converter or custom scripts
# Upload via API or HAPI FHIR admin interface
```

## Environment Configuration

### Development (.env.local)

```bash
# Local HAPI FHIR server
NEXT_PUBLIC_FHIR_BASE_URL=http://localhost:8080/baseR4

# Optional: API key if required
# NEXT_PUBLIC_FHIR_API_KEY=your_api_key
```

### Production (.env.production)

```bash
# Production FHIR server
NEXT_PUBLIC_FHIR_BASE_URL=https://your-fhir-server.com/baseR4

# Required: Production API key
NEXT_PUBLIC_FHIR_API_KEY=your_production_api_key
```

## CORS Configuration

If you're hosting the dashboard on a different domain than your FHIR server, you'll need to configure CORS:

### HAPI FHIR CORS Configuration

```java
// In your HAPI FHIR configuration
@Configuration
public class FhirServerConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000", "https://your-dashboard.com"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
```

### Nginx CORS Configuration

```nginx
# In your nginx.conf
location /baseR4/ {
    add_header 'Access-Control-Allow-Origin' 'http://localhost:3000' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
    add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;

    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' 'http://localhost:3000' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain; charset=utf-8';
        add_header 'Content-Length' 0;
        return 204;
    }
}
```

## Testing Your Setup

### 1. Verify Server Connection

```bash
# Test basic connectivity
curl http://localhost:8080/baseR4/metadata

# Expected response: FHIR CapabilityStatement
```

### 2. Test Data Retrieval

```bash
# Test patient search
curl "http://localhost:8080/baseR4/Patient?_count=10"

# Test encounter search
curl "http://localhost:8080/baseR4/Encounter?_count=10"
```

### 3. Test Dashboard Integration

1. Update your environment variables
2. Restart the dashboard
3. Check browser console for API calls
4. Verify data is loading from your server

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS configuration on FHIR server
   - Verify allowed origins include your dashboard domain

2. **Authentication Errors**
   - Check API key configuration
   - Verify token expiration
   - Check required scopes/permissions

3. **Data Not Loading**
   - Verify FHIR server has data
   - Check API endpoint URLs
   - Review browser network tab for errors

4. **Performance Issues**
   - Implement pagination
   - Add caching layers
   - Optimize FHIR queries

### Debug Mode

Enable detailed logging:

```bash
# In your dashboard
NODE_ENV=development

# Check browser console for detailed API logs
# Check FHIR server logs for incoming requests
```

## Security Considerations

### Production Checklist

- [ ] Use HTTPS for all communications
- [ ] Implement proper authentication (OAuth2, JWT, etc.)
- [ ] Configure CORS to only allow necessary origins
- [ ] Implement rate limiting
- [ ] Log and monitor API access
- [ ] Regular security updates
- [ ] Data encryption at rest and in transit

### Authentication Methods

1. **OAuth2 with SMART on FHIR**
2. **JWT tokens**
3. **API keys**
4. **Client certificates**
5. **SAML/SSO integration**

## Next Steps

After setting up your FHIR server:

1. **Populate with real data** from your healthcare system
2. **Configure authentication** for production use
3. **Set up monitoring** and alerting
4. **Implement backup** and disaster recovery
5. **Train users** on the new dashboard
6. **Plan scaling** for increased usage

## Resources

- [HAPI FHIR Documentation](https://hapifhir.io/)
- [FHIR Specification](https://www.hl7.org/fhir/)
- [SMART on FHIR](http://docs.smarthealthit.org/)
- [FHIR Implementation Guides](https://www.hl7.org/fhir/implementation.html)
