# Phase 1: Foundation & Core Architecture

## 🎯 Objetivos

- Estabelecer a base arquitetural sólida do projeto
- Configurar ambiente de desenvolvimento profissional
- Implementar estrutura de pastas e organização de código
- Definir sistema de tipos e validação FHIR

## 📁 Estrutura de Pastas

### 🏗️ Arquitetura Clean Architecture + Next.js

```
src/
├── app/                    # 🚀 Next.js App Router (Obrigatório)
│   ├── page.tsx           # Página principal (rota /)
│   ├── layout.tsx         # Layout raiz da aplicação
│   ├── globals.css        # Estilos globais
│   └── favicon.ico        # Favicon da aplicação
├── domain/                 # 🎯 Entidades e regras de negócio
│   ├── entities/          # Entidades FHIR (Patient, Encounter, etc.)
│   ├── value-objects/     # Objetos de valor (DateRange, Status, etc.)
│   └── repositories/      # Interfaces dos repositórios
├── application/            # ⚙️ Casos de uso e serviços
│   ├── use-cases/         # Lógica de negócio
│   ├── services/          # Serviços de aplicação
│   └── dto/               # Data Transfer Objects
├── infrastructure/         # 🔌 Implementações externas
│   ├── api/               # Cliente HTTP e APIs FHIR
│   ├── cache/             # Sistema de cache
│   ├── storage/           # Persistência local
│   ├── providers/         # Provedores (React Query, etc.)
│   ├── queries/           # Queries e mutations
│   ├── service-worker/    # Service Worker
│   └── store/             # Estado global (Zustand)
├── presentation/           # 🎨 Componentes e páginas
│   ├── components/        # Componentes reutilizáveis
│   ├── pages/             # Páginas da aplicação (reutilizáveis)
│   └── hooks/             # Custom hooks
└── shared/                 # 🔧 Utilitários compartilhados
    ├── types/             # Tipos TypeScript
    ├── utils/             # Funções utilitárias
    ├── constants/         # Constantes da aplicação
    └── config/            # Configurações
```

### 🔄 Integração Next.js + Clean Architecture

**Pasta `src/app/`:**

- **Obrigatória** para o Next.js App Router funcionar
- Contém apenas arquivos essenciais do Next.js
- **NÃO** contém lógica de negócio ou componentes

**Pasta `src/presentation/pages/`:**

- Contém componentes de página reutilizáveis
- Importados pelas rotas do `src/app/`
- Segue a arquitetura Clean Architecture

**Fluxo de Integração:**

```
src/app/page.tsx → importa → src/presentation/pages/ → usa → src/domain/entities/
```

## 🛠️ Configurações Iniciais

### Dependências Principais

```json
{
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    "zod": "^3.22.0",
    "tailwindcss": "^3.3.0",
    "@radix-ui/react-*": "^1.0.0",
    "recharts": "^2.8.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^13.0.0",
    "@playwright/test": "^1.40.0"
  }
}
```

### Configuração TypeScript (tsconfig.json)

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/domain/*": ["./src/domain/*"],
      "@/application/*": ["./src/application/*"],
      "@/infrastructure/*": ["./src/infrastructure/*"],
      "@/presentation/*": ["./src/presentation/*"],
      "@/shared/*": ["./src/shared/*"]
    }
  }
}
```

## 🏥 Sistema de Tipos FHIR

### Entidades Base

```typescript
// src/domain/entities/base-entity.ts
export interface BaseEntity {
  id: string;
  resourceType: string;
  meta?: {
    versionId?: string;
    lastUpdated?: string;
    profile?: string[];
  };
}

// src/domain/entities/patient.ts
export interface Patient extends BaseEntity {
  resourceType: 'Patient';
  identifier?: Identifier[];
  name?: HumanName[];
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
  address?: Address[];
  telecom?: ContactPoint[];
}

// src/domain/entities/encounter.ts
export interface Encounter extends BaseEntity {
  resourceType: 'Encounter';
  status:
    | 'planned'
    | 'arrived'
    | 'triaged'
    | 'in-progress'
    | 'onleave'
    | 'finished'
    | 'cancelled';
  class: Coding;
  type?: CodeableConcept[];
  subject: Reference<Patient>;
  participant?: EncounterParticipant[];
  period?: Period;
  serviceProvider?: Reference<Organization>;
}
```

### Value Objects

```typescript
// src/domain/value-objects/date-range.ts
export class DateRange {
  constructor(
    public readonly start: Date,
    public readonly end: Date
  ) {
    if (start > end) {
      throw new Error('Start date must be before end date');
    }
  }

  static fromISO(start: string, end: string): DateRange {
    return new DateRange(new Date(start), new Date(end));
  }

  getDays(): number {
    return Math.ceil(
      (this.end.getTime() - this.start.getTime()) / (1000 * 60 * 60 * 24)
    );
  }
}

// src/domain/value-objects/status.ts
export type EncounterStatus =
  | 'planned'
  | 'arrived'
  | 'triaged'
  | 'in-progress'
  | 'onleave'
  | 'finished'
  | 'cancelled';

export class Status {
  constructor(public readonly value: EncounterStatus) {}

  isActive(): boolean {
    return ['arrived', 'triaged', 'in-progress'].includes(this.value);
  }

  isCompleted(): boolean {
    return ['finished', 'cancelled'].includes(this.value);
  }
}
```

## 🔧 Configuração de Ferramentas

### ESLint Configuration

```javascript
// eslint.config.mjs
export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];
```

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        healthcare: {
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          info: '#06b6d4',
        },
      },
    },
  },
  plugins: [],
};
```

## 🧪 Testes de Base

### Setup Jest

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@/application/(.*)$': '<rootDir>/src/application/$1',
    '^@/infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@/presentation/(.*)$': '<rootDir>/src/presentation/$1',
    '^@/shared/(.*)$': '<rootDir>/src/shared/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/app/**/*',
  ],
};
```

### Testes de Entidades

```typescript
// src/domain/entities/__tests__/encounter.test.ts
import { Encounter } from '../encounter';

describe('Encounter Entity', () => {
  it('should create a valid encounter', () => {
    const encounter: Encounter = {
      id: 'encounter-1',
      resourceType: 'Encounter',
      status: 'in-progress',
      class: {
        code: 'AMB',
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      },
      subject: { reference: 'Patient/patient-1' },
    };

    expect(encounter.resourceType).toBe('Encounter');
    expect(encounter.status).toBe('in-progress');
  });
});
```

### Testes de Value Objects

```typescript
// src/domain/value-objects/__tests__/date-range.test.ts
import { DateRange } from '../date-range';

describe('DateRange Value Object', () => {
  it('should create a valid date range', () => {
    const start = new Date('2024-01-01');
    const end = new Date('2024-01-31');
    const dateRange = new DateRange(start, end);

    expect(dateRange.getDays()).toBe(30);
  });
});
```

## 📊 Métricas de Qualidade

### Cobertura de Código

- **Lines**: >90%
- **Functions**: >90%
- **Branches**: >80%
- **Statements**: >90%

### Performance

- **Bundle Size**: <500KB (gzipped)
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s

## ✅ Checklist de Entrega

- [ ] Estrutura de pastas implementada (Clean Architecture)
- [ ] Integração Next.js App Router configurada
- [ ] Configuração TypeScript com strict mode
- [ ] Sistema de tipos FHIR implementado
- [ ] Value Objects criados
- [ ] Configuração ESLint e Prettier
- [ ] Setup de testes com Jest
- [ ] Configuração Tailwind CSS
- [ ] Documentação de arquitetura
- [ ] Testes de base passando
- [ ] Build funcionando sem erros
- [ ] Pasta `src/app/` preservada para Next.js
- [ ] Pasta `src/presentation/pages/` implementada

## 🚀 Próximos Passos

Após completar esta fase, você terá:

1. **Base arquitetural sólida e escalável** com Clean Architecture
2. **Integração perfeita** entre Next.js e Clean Architecture
3. **Sistema de tipos robusto** para dados FHIR
4. **Ambiente de desenvolvimento profissional** com testes
5. **Estrutura para implementar funcionalidades complexas**
6. **Separação clara** entre lógica de negócio e apresentação

### 🎯 Benefícios da Arquitetura Híbrida

- **Next.js App Router**: Funcionalidade completa e otimizada
- **Clean Architecture**: Código organizado e testável
- **Separação de responsabilidades**: Fácil manutenção e evolução
- **Testabilidade**: Componentes isolados e testáveis
- **Escalabilidade**: Estrutura preparada para crescimento

**Tempo estimado**: 2-3 dias
**Complexidade**: Baixa-Média
**Dependências**: Next.js 14+

## 🔧 Como Usar a Arquitetura Híbrida

### 📝 Criando uma Nova Página

1. **Criar componente em `src/presentation/pages/`:**

```typescript
// src/presentation/pages/example/index.tsx
export const ExamplePage = () => {
  // Lógica da página
};
```

2. **Importar no App Router:**

```typescript
// src/app/example/page.tsx
import { ExamplePage } from '@/presentation/pages/example';

export default function Page() {
  return <ExamplePage />;
}
```

### 🎯 Criando um Novo Caso de Uso

1. **Implementar em `src/application/use-cases/`:**

```typescript
// src/application/use-cases/example-use-case.ts
export class ExampleUseCase {
  execute() {
    // Lógica de negócio
  }
}
```

2. **Usar no componente:**

```typescript
import { ExampleUseCase } from '@/application/use-cases/example-use-case';

const useCase = new ExampleUseCase();
```

### 🏗️ Princípios da Arquitetura

- **Domain**: Contém apenas regras de negócio puras
- **Application**: Orquestra casos de uso e serviços
- **Infrastructure**: Implementa interfaces externas
- **Presentation**: Renderiza UI e gerencia estado local
- **Shared**: Utilitários e tipos compartilhados
- **App Router**: Apenas roteamento e configuração Next.js
