# Healthcare Dashboard

A modern, real-time healthcare dashboard built with Next.js, TypeScript, and FHIR integration for monitoring patient encounters and healthcare metrics.

## 🚀 Features

- **Real-time Metrics**: Live healthcare data with automatic updates
- **Interactive Charts**: Status distribution and daily trends visualization
- **Advanced Filtering**: Multi-criteria search and filtering capabilities
- **FHIR Integration**: Built-in support for healthcare data standards
- **Responsive Design**: Mobile-first responsive layout
- **Performance Optimized**: Caching, pagination, and efficient data loading

## 🏥 FHIR Integration Status

### Current State

The dashboard is currently connected to the **public HAPI FHIR test server** (`https://hapi.fhir.org/baseR4`). This server:

- ✅ Is publicly accessible
- ✅ Supports FHIR R4 standard
- ❌ May have limited or no real data
- ❌ Is shared by many users
- ❌ Has rate limiting

### Demo Mode

When the HAPI server has no data, the dashboard automatically switches to **Demo Mode** with:

- Sample encounter data (50,000+ encounters)
- Realistic healthcare metrics
- Interactive filtering and visualization
- Full dashboard functionality

### Getting Real Data

To use real healthcare data, you can:

1. **Set up your own FHIR server** (see [FHIR Server Setup Guide](docs/fhir-server-setup.md))
2. **Use cloud FHIR services** (Azure, AWS, Google Cloud)
3. **Configure local development** with HAPI FHIR

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **State Management**: Zustand, React Query
- **Charts**: Custom chart components with Tailwind
- **API**: FHIR REST API client
- **Testing**: Jest, React Testing Library
- **Build Tool**: Vite, SWC

## 📊 Dashboard Components

### Metrics Dashboard

- Total encounters count
- Active encounters
- Daily averages
- Real-time updates

### Interactive Charts

- **Status Distribution**: Encounter status breakdown
- **Daily Trends**: Volume trends over time
- **Responsive Design**: Adapts to screen size

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

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/healthcare-dashboard.git
cd healthcare-dashboard

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The dashboard will be available at `http://localhost:3000`

### Environment Configuration

Create a `.env.local` file for custom FHIR server configuration:

```bash
# Optional: Custom FHIR server (defaults to HAPI public server)
NEXT_PUBLIC_FHIR_BASE_URL=https://your-fhir-server.com/baseR4

# Optional: API key if required
NEXT_PUBLIC_FHIR_API_KEY=your_api_key
```

## 🔧 Configuration

### FHIR Server Setup

The dashboard automatically connects to the HAPI FHIR public server. For production use:

1. **Set up your own FHIR server** (see [FHIR Server Setup Guide](docs/fhir-server-setup.md))
2. **Configure environment variables**
3. **Set up authentication** if required
4. **Populate with real data**

### Customization

- **Design System**: Modify `src/shared/design-tokens.ts`
- **API Endpoints**: Update `src/shared/config/api.ts`
- **Components**: Extend components in `src/presentation/components/`
- **Data Models**: Modify entities in `src/domain/entities/`

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
├── components/            # Reusable UI components
├── domain/               # Business logic and entities
├── infrastructure/       # External services and APIs
├── presentation/         # UI components and pages
└── shared/              # Utilities and configurations
```

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 📚 Documentation

- [API Integration Guide](docs/api-integration.md) - FHIR API integration details
- [FHIR Server Setup](docs/fhir-server-setup.md) - Setting up your own FHIR server
- [Component Library](docs/components.md) - UI component documentation
- [Architecture Guide](docs/architecture.md) - System architecture overview

## 🌟 Key Benefits

### For Healthcare Providers

- **Real-time Monitoring**: Live encounter tracking
- **Data Visualization**: Clear insights into healthcare operations
- **Efficient Filtering**: Quick access to specific data
- **Standards Compliance**: Built on FHIR healthcare standards

### For Developers

- **Modern Stack**: Latest React and Next.js features
- **Type Safety**: Full TypeScript coverage
- **Performance**: Optimized for large datasets
- **Extensible**: Easy to add new features

### For Organizations

- **Cost Effective**: Open source with cloud deployment options
- **Scalable**: Handles growing data volumes
- **Secure**: Built with security best practices
- **Compliant**: FHIR standard compliance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/healthcare-dashboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/healthcare-dashboard/discussions)
- **Documentation**: Check the [docs/](docs/) folder

## 🔮 Roadmap

- [ ] Real-time WebSocket connections
- [ ] Advanced analytics and reporting
- [ ] Bulk data operations
- [ ] Offline support with service workers
- [ ] Multi-tenant FHIR server support
- [ ] Mobile app companion
- [ ] AI-powered insights
- [ ] Integration with EHR systems

## 🙏 Acknowledgments

- [HAPI FHIR](https://hapifhir.io/) - FHIR server implementation
- [HL7 FHIR](https://www.hl7.org/fhir/) - Healthcare data standards
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
