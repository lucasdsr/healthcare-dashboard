# Healthcare Dashboard

A modern, scalable healthcare dashboard built with Next.js, TypeScript, and FHIR standards.

## 🏗️ Architecture

This project follows Clean Architecture principles with a clear separation of concerns:

- **Domain Layer**: Core business entities and value objects
- **Application Layer**: Use cases and business logic
- **Infrastructure Layer**: External services and data access
- **Presentation Layer**: UI components and pages

## 🚀 Phase 1: Foundation & Core Architecture

Phase 1 has been completed with the following features:

### ✅ Completed Features

- **Project Structure**: Clean architecture folder organization
- **TypeScript Configuration**: Strict mode with path aliases
- **FHIR Types**: Complete FHIR resource type definitions
- **Domain Entities**: Patient and Encounter entities
- **Value Objects**: DateRange and Status with business logic
- **Repository Interfaces**: Data access abstractions
- **Use Cases**: Business logic implementation
- **API Client**: FHIR API integration
- **Cache Service**: In-memory and localStorage caching
- **UI Components**: Reusable Radix UI components
- **Design System**: Tailwind CSS with healthcare-specific styles
- **Testing**: Jest setup with comprehensive test coverage

### 🏥 FHIR Resources

- **Patient**: Complete patient information model
- **Encounter**: Healthcare encounter tracking
- **Value Objects**: DateRange, Status with business rules

### 🎨 UI Components

- **Button**: Variant-based button component
- **Card**: Flexible card layout system
- **Design System**: Healthcare-specific color palette and utilities

### 🧪 Testing

- **Test Coverage**: 58 tests passing
- **Coverage Areas**: Domain entities, value objects, UI components, utilities
- **Test Setup**: Jest with React Testing Library

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Library**: Radix UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Testing**: Jest + React Testing Library
- **Package Manager**: pnpm

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
├── domain/                 # Business entities and rules
│   ├── entities/          # FHIR entities (Patient, Encounter)
│   ├── value-objects/     # Business value objects
│   └── repositories/      # Data access interfaces
├── application/            # Business logic and use cases
│   └── use-cases/         # Application use cases
├── infrastructure/         # External services
│   ├── api/               # FHIR API client
│   └── cache/             # Caching services
├── presentation/           # UI components
│   └── components/        # Reusable components
└── shared/                 # Shared utilities
    ├── types/             # TypeScript types
    ├── utils/             # Utility functions
    └── constants/         # Application constants
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd healthcare-dashboard

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_FHIR_BASE_URL=http://localhost:8080/fhir
```

## 📊 Current Status

- **Phase 1**: ✅ Complete
- **Phase 2**: 🔄 Next (Data Layer Implementation)
- **Phase 3**: ⏳ Pending (Core Dashboard)
- **Phase 4**: ⏳ Pending (Advanced Features)
- **Phase 5**: ⏳ Pending (Testing & Polish)

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## 📝 Development Guidelines

- Follow Clean Architecture principles
- Write comprehensive tests for new features
- Use TypeScript strict mode
- Follow the established folder structure
- Reuse existing components when possible
- Maintain FHIR compliance

## 🔗 FHIR Resources

This project implements FHIR R4 standards for healthcare data exchange. For more information, visit:

- [FHIR Specification](https://www.hl7.org/fhir/)
- [FHIR Resources](https://www.hl7.org/fhir/resourcelist.html)

## 📄 License

This project is licensed under the MIT License.
