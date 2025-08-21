# Phase 2: Data Layer & State Management

## 🎯 Objetivos

- Implementar sistema de cache inteligente para dados FHIR
- Configurar gestão de estado robusta com Zustand
- Integrar com APIs FHIR externas
- Implementar normalização de dados relacionais
- Estabelecer sistema de sincronização offline-first

## 🏗️ Arquitetura da Camada de Dados

### Estrutura de Camadas

```
┌─────────────────────────────────────┐
│        Presentation Layer           │ ← Componentes React
├─────────────────────────────────────┤
│        Application Layer            │ ← Casos de uso e serviços
├─────────────────────────────────────┤
│        Domain Layer                 │ ← Entidades e regras
├─────────────────────────────────────┤
│      Infrastructure Layer           │ ← APIs, Cache, Storage
└─────────────────────────────────────┘
```

## 📡 Integração com APIs FHIR

### Cliente HTTP Base

```typescript
// src/infrastructure/api/http-client.ts
export class HttpClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/fhir+json',
    };
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(endpoint, this.baseURL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}
```

### Cliente FHIR Específico

```typescript
// src/infrastructure/api/fhir-client.ts
import { HttpClient } from './http-client';
import {
  Encounter,
  Patient,
  Practitioner,
  Organization,
} from '@/domain/entities';
import { Bundle, Reference } from '@/domain/types';

export class FhirClient {
  private httpClient: HttpClient;

  constructor(baseURL: string) {
    this.httpClient = new HttpClient(baseURL);
  }

  async getEncounters(params: {
    _count?: number;
    _page?: number;
    status?: string;
    date?: string;
    patient?: string;
  }): Promise<Bundle<Encounter>> {
    const queryParams = new URLSearchParams();

    if (params._count) queryParams.append('_count', params._count.toString());
    if (params._page) queryParams.append('_page', params._page.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.date) queryParams.append('date', params.date);
    if (params.patient) queryParams.append('patient', params.patient);

    return this.httpClient.get<Bundle<Encounter>>(`/Encounter?${queryParams}`);
  }

  async getPatient(id: string): Promise<Patient> {
    return this.httpClient.get<Patient>(`/Patient/${id}`);
  }

  async getPractitioner(id: string): Promise<Practitioner> {
    return this.httpClient.get<Practitioner>(`/Practitioner/${id}`);
  }

  async getOrganization(id: string): Promise<Organization> {
    return this.httpClient.get<Organization>(`/Organization/${id}`);
  }

  async resolveReference<T>(reference: Reference): Promise<T> {
    const [resourceType, id] = reference.reference.split('/');
    return this.httpClient.get<T>(`/${resourceType}/${id}`);
  }
}
```

## 🗄️ Sistema de Cache Inteligente

### Estratégia de Cache por Tipo

```typescript
// src/infrastructure/cache/cache-strategy.ts
export interface CacheStrategy {
  ttl: number;
  maxSize: number;
  priority: 'high' | 'medium' | 'low';
}

export const CACHE_STRATEGIES: Record<string, CacheStrategy> = {
  encounters: {
    ttl: 5 * 60 * 1000, // 5 minutos
    maxSize: 1000,
    priority: 'high',
  },
  patients: {
    ttl: 30 * 60 * 1000, // 30 minutos
    maxSize: 5000,
    priority: 'high',
  },
  practitioners: {
    ttl: 60 * 60 * 1000, // 1 hora
    maxSize: 1000,
    priority: 'medium',
  },
  organizations: {
    ttl: 24 * 60 * 60 * 1000, // 24 horas
    maxSize: 100,
    priority: 'low',
  },
};
```

### Implementação do Cache

```typescript
// src/infrastructure/cache/memory-cache.ts
export class MemoryCache<T> {
  private cache = new Map<
    string,
    { data: T; timestamp: number; ttl: number }
  >();
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  set(key: string, data: T, ttl: number): void {
    this.cleanup();

    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }
}
```

## 🔄 Gestão de Estado com Zustand

### Store Principal

```typescript
// src/infrastructure/store/encounter-store.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  Encounter,
  Patient,
  Practitioner,
  Organization,
} from '@/domain/entities';

interface EncounterState {
  encounters: Record<string, Encounter>;
  patients: Record<string, Patient>;
  practitioners: Record<string, Practitioner>;
  organizations: Record<string, Organization>;

  // Loading states
  isLoading: boolean;
  loadingStates: Record<string, boolean>;

  // Pagination
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };

  // Actions
  setEncounters: (encounters: Encounter[]) => void;
  setEncounter: (encounter: Encounter) => void;
  setPatient: (patient: Patient) => void;
  setPractitioner: (practitioner: Practitioner) => void;
  setOrganization: (organization: Organization) => void;

  setLoading: (loading: boolean) => void;
  setLoadingState: (key: string, loading: boolean) => void;

  setPagination: (pagination: Partial<EncounterState['pagination']>) => void;

  // Selectors
  getEncounter: (id: string) => Encounter | undefined;
  getPatient: (id: string) => Patient | undefined;
  getPractitioner: (id: string) => Practitioner | undefined;
  getOrganization: (id: string) => Organization | undefined;

  getEncountersByStatus: (status: string) => Encounter[];
  getEncountersByPatient: (patientId: string) => Encounter[];
}

export const useEncounterStore = create<EncounterState>()(
  devtools(
    persist(
      (set, get) => ({
        encounters: {},
        patients: {},
        practitioners: {},
        organizations: {},

        isLoading: false,
        loadingStates: {},

        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          pageSize: 50,
        },

        setEncounters: encounters => {
          const encountersMap = encounters.reduce(
            (acc, encounter) => {
              acc[encounter.id] = encounter;
              return acc;
            },
            {} as Record<string, Encounter>
          );

          set(state => ({
            encounters: { ...state.encounters, ...encountersMap },
          }));
        },

        setEncounter: encounter => {
          set(state => ({
            encounters: { ...state.encounters, [encounter.id]: encounter },
          }));
        },

        setPatient: patient => {
          set(state => ({
            patients: { ...state.patients, [patient.id]: patient },
          }));
        },

        setPractitioner: practitioner => {
          set(state => ({
            practitioners: {
              ...state.practitioners,
              [practitioner.id]: practitioner,
            },
          }));
        },

        setOrganization: organization => {
          set(state => ({
            organizations: {
              ...state.organizations,
              [organization.id]: organization,
            },
          }));
        },

        setLoading: loading => set({ isLoading: loading }),

        setLoadingState: (key, loading) => {
          set(state => ({
            loadingStates: { ...state.loadingStates, [key]: loading },
          }));
        },

        setPagination: pagination => {
          set(state => ({
            pagination: { ...state.pagination, ...pagination },
          }));
        },

        getEncounter: id => get().encounters[id],
        getPatient: id => get().patients[id],
        getPractitioner: id => get().practitioners[id],
        getOrganization: id => get().organizations[id],

        getEncountersByStatus: status => {
          const state = get();
          return Object.values(state.encounters).filter(
            encounter => encounter.status === status
          );
        },

        getEncountersByPatient: patientId => {
          const state = get();
          return Object.values(state.encounters).filter(
            encounter => encounter.subject.reference === `Patient/${patientId}`
          );
        },
      }),
      {
        name: 'encounter-store',
        partialize: state => ({
          encounters: state.encounters,
          patients: state.patients,
          practitioners: state.practitioners,
          organizations: state.organizations,
        }),
      }
    )
  )
);
```

## 🔗 TanStack Query Integration

### Query Hooks

```typescript
// src/infrastructure/queries/encounter-queries.ts
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { FhirClient } from '../api/fhir-client';
import { useEncounterStore } from '../store/encounter-store';

const fhirClient = new FhirClient('https://hapi.fhir.org/baseR4');

export const useEncounters = (params: {
  _count?: number;
  _page?: number;
  status?: string;
  date?: string;
  patient?: string;
}) => {
  const { setEncounters, setPagination } = useEncounterStore();

  return useQuery({
    queryKey: ['encounters', params],
    queryFn: async () => {
      const result = await fhirClient.getEncounters(params);

      // Normalize and store data
      if (result.entry) {
        const encounters = result.entry.map(entry => entry.resource);
        setEncounters(encounters);

        // Extract pagination info
        if (result.total) {
          setPagination({
            totalCount: result.total,
            totalPages: Math.ceil(result.total / (params._count || 50)),
          });
        }
      }

      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useInfiniteEncounters = (params: {
  _count?: number;
  status?: string;
  date?: string;
  patient?: string;
}) => {
  const { setEncounters } = useEncounterStore();

  return useInfiniteQuery({
    queryKey: ['encounters', 'infinite', params],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await fhirClient.getEncounters({
        ...params,
        _page: pageParam,
        _count: params._count || 50,
      });

      if (result.entry) {
        const encounters = result.entry.map(entry => entry.resource);
        setEncounters(encounters);
      }

      return result;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.entry && lastPage.entry.length === (params._count || 50)) {
        return allPages.length + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
```

## 📱 Sincronização Offline-First

### Service Worker para Cache

```typescript
// public/sw.js
const CACHE_NAME = 'healthcare-dashboard-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

const STATIC_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(STATIC_URLS);
    })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.url.includes('/baseR4/')) {
    // Cache FHIR API responses
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.match(request).then(response => {
          if (response) {
            return response;
          }

          return fetch(request).then(fetchResponse => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  } else {
    // Static assets
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request);
      })
    );
  }
});
```

## 🔄 Optimistic Updates

### Middleware para Zustand

```typescript
// src/infrastructure/store/optimistic-middleware.ts
import { StateCreator } from 'zustand';

export interface OptimisticState {
  optimisticUpdates: Array<{
    id: string;
    type: 'encounter' | 'patient' | 'practitioner' | 'organization';
    data: unknown;
    timestamp: number;
  }>;
}

export const optimisticMiddleware =
  <T extends OptimisticState>(config: StateCreator<T>): StateCreator<T> =>
  (set, get, api) => {
    const state = config(set, get, api);

    const addOptimisticUpdate = (
      type: OptimisticState['optimisticUpdates'][0]['type'],
      id: string,
      data: unknown
    ) => {
      set(state => ({
        optimisticUpdates: [
          ...state.optimisticUpdates,
          {
            id,
            type,
            data,
            timestamp: Date.now(),
          },
        ],
      }));
    };

    const removeOptimisticUpdate = (id: string) => {
      set(state => ({
        optimisticUpdates: state.optimisticUpdates.filter(
          update => update.id !== id
        ),
      }));
    };

    return {
      ...state,
      addOptimisticUpdate,
      removeOptimisticUpdate,
    };
  };
```

## 📊 Métricas de Performance

### Indicadores de Cache

- **Cache Hit Rate**: >80%
- **Cache Miss Penalty**: <200ms
- **Memory Usage**: <100MB para 10k encounters
- **Offline Functionality**: 100% dos dados recentes

### Indicadores de Estado

- **State Update Time**: <16ms
- **Memory Leaks**: 0
- **Store Size**: <5MB serializado

## ✅ Checklist de Entrega

- [ ] Cliente HTTP base implementado
- [ ] Cliente FHIR específico funcionando
- [ ] Sistema de cache com estratégias por tipo
- [ ] Store Zustand com normalização de dados
- [ ] Integração TanStack Query configurada
- [ ] Service Worker para cache offline
- [ ] Middleware de optimistic updates
- [ ] Testes de integração com APIs
- [ ] Testes de performance de cache
- [ ] Documentação de uso das queries

## 🚀 Próximos Passos

Após completar esta fase, você terá:

1. Sistema de dados robusto e escalável
2. Cache inteligente para performance
3. Gestão de estado centralizada
4. Suporte offline para dados críticos
5. Base para implementar funcionalidades complexas

**Tempo estimado**: 2-3 dias
**Complexidade**: Média-Alta
**Dependências**: Phase 1 completa
