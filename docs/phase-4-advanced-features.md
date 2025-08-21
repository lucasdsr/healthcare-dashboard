# Phase 4: Advanced Features & Performance

## 🎯 Objetivos

- Implementar sistema de busca avançada com query builder visual
- Otimizar performance com virtual scrolling e lazy loading
- Implementar sistema de notificações em tempo real
- Criar funcionalidades de persistência e compartilhamento
- Implementar sistema de monitoramento e observabilidade

## 🔍 Sistema de Busca Avançada

### Query Builder Visual

```typescript
// src/presentation/components/search/query-builder.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import {
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface QueryCondition {
  id: string;
  field: string;
  operator: string;
  value: string | number | boolean;
  logicalOperator: 'AND' | 'OR';
}

interface QueryBuilderProps {
  onQueryChange: (query: QueryCondition[]) => void;
  onExecute: (query: QueryCondition[]) => void;
}

const FIELD_OPTIONS = [
  { value: 'status', label: 'Status' },
  { value: 'patient.name', label: 'Patient Name' },
  { value: 'practitioner.name', label: 'Practitioner Name' },
  { value: 'date', label: 'Date' },
  { value: 'type', label: 'Type' },
  { value: 'organization', label: 'Organization' }
];

const OPERATOR_OPTIONS = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'starts_with', label: 'Starts With' },
  { value: 'ends_with', label: 'Ends With' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'between', label: 'Between' }
];

export const QueryBuilder: React.FC<QueryBuilderProps> = ({
  onQueryChange,
  onExecute
}) => {
  const [conditions, setConditions] = useState<QueryCondition[]>([
    {
      id: '1',
      field: 'status',
      operator: 'equals',
      value: '',
      logicalOperator: 'AND'
    }
  ]);

  const [queryName, setQueryName] = useState('');
  const [savedQueries, setSavedQueries] = useState<Array<{
    id: string;
    name: string;
    conditions: QueryCondition[];
  }>>([]);

  const addCondition = () => {
    const newCondition: QueryCondition = {
      id: Date.now().toString(),
      field: 'status',
      operator: 'equals',
      value: '',
      logicalOperator: 'AND'
    };

    const newConditions = [...conditions, newCondition];
    setConditions(newConditions);
    onQueryChange(newConditions);
  };

  const removeCondition = (id: string) => {
    const newConditions = conditions.filter(c => c.id !== id);
    setConditions(newConditions);
    onQueryChange(newConditions);
  };

  const updateCondition = (id: string, updates: Partial<QueryCondition>) => {
    const newConditions = conditions.map(c =>
      c.id === id ? { ...c, ...updates } : c
    );
    setConditions(newConditions);
    onQueryChange(newConditions);
  };

  const saveQuery = () => {
    if (!queryName.trim()) return;

    const newQuery = {
      id: Date.now().toString(),
      name: queryName,
      conditions: [...conditions]
    };

    setSavedQueries([...savedQueries, newQuery]);
    setQueryName('');

    localStorage.setItem('savedQueries', JSON.stringify([...savedQueries, newQuery]));
  };

  const loadQuery = (query: typeof savedQueries[0]) => {
    setConditions(query.conditions);
    onQueryChange(query.conditions);
  };

  const executeQuery = () => {
    onExecute(conditions);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5" />
          <span>Advanced Query Builder</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Query Name Input */}
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Query name (optional)"
            className="flex-1 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={queryName}
            onChange={(e) => setQueryName(e.target.value)}
          />
          <Button onClick={saveQuery} disabled={!queryName.trim()}>
            Save Query
          </Button>
        </div>

        {/* Conditions */}
        <div className="space-y-3">
          {conditions.map((condition, index) => (
            <div key={condition.id} className="flex items-center space-x-2 p-3 border border-neutral-200 rounded-lg">
              {index > 0 && (
                <select
                  className="px-2 py-1 border border-neutral-300 rounded text-sm"
                  value={condition.logicalOperator}
                  onChange={(e) => updateCondition(condition.id, { logicalOperator: e.target.value as 'AND' | 'OR' })}
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>
              )}

              <select
                className="px-3 py-2 border border-neutral-300 rounded-md text-sm"
                value={condition.field}
                onChange={(e) => updateCondition(condition.id, { field: e.target.value })}
              >
                {FIELD_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                className="px-3 py-2 border border-neutral-300 rounded-md text-sm"
                value={condition.operator}
                onChange={(e) => updateCondition(condition.id, { operator: e.target.value })}
              >
                {OPERATOR_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Value"
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={condition.value}
                onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() => removeCondition(condition.id)}
                disabled={conditions.length === 1}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add Condition Button */}
        <Button variant="outline" onClick={addCondition} className="w-full">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Condition
        </Button>

        {/* Execute Query */}
        <Button onClick={executeQuery} className="w-full">
          <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
          Execute Query
        </Button>

        {/* Saved Queries */}
        {savedQueries.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">Saved Queries</h4>
            <div className="space-y-2">
              {savedQueries.map(query => (
                <div key={query.id} className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                  <span className="text-sm">{query.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => loadQuery(query)}
                  >
                    Load
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

## ⚡ Otimizações de Performance

### Virtual Scrolling para Listas Grandes

```typescript
// src/presentation/components/ui/virtual-list.tsx
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

export function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 5
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className="overflow-auto"
      style={{ height }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${itemHeight}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Lazy Loading de Módulos

```typescript
// src/presentation/components/lazy-module-loader.tsx
import React, { Suspense, lazy } from 'react';
import { Skeleton } from '@/presentation/components/ui/skeleton';

interface LazyModuleLoaderProps {
  moduleName: string;
  fallback?: React.ReactNode;
}

const moduleMap: Record<string, React.LazyExoticComponent<any>> = {
  'advanced-search': lazy(() => import('../search/advanced-search')),
  'encounter-details': lazy(() => import('../encounters/encounter-details')),
  'patient-history': lazy(() => import('../patients/patient-history')),
  'practitioner-schedule': lazy(() => import('../practitioners/practitioner-schedule')),
  'organization-stats': lazy(() => import('../organizations/organization-stats')),
  'reports-generator': lazy(() => import('../reports/reports-generator')),
  'settings-panel': lazy(() => import('../settings/settings-panel')),
  'user-management': lazy(() => import('../admin/user-management'))
};

const DefaultFallback = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-64 w-full" />
    <Skeleton className="h-32 w-3/4" />
  </div>
);

export const LazyModuleLoader: React.FC<LazyModuleLoaderProps> = ({
  moduleName,
  fallback = <DefaultFallback />
}) => {
  const LazyComponent = moduleMap[moduleName];

  if (!LazyComponent) {
    return (
      <div className="p-6 text-center">
        <p className="text-neutral-500">Module "{moduleName}" not found</p>
      </div>
    );
  }

  return (
    <Suspense fallback={fallback}>
      <LazyComponent />
    </Suspense>
  );
};
```

## 🔔 Sistema de Notificações em Tempo Real

### WebSocket Manager

```typescript
// src/infrastructure/notifications/websocket-manager.ts
export class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private isConnecting = false;

  constructor(private url: string) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error('Connection already in progress'));
        return;
      }

      this.isConnecting = true;

      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = event => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = event => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.isConnecting = false;

          if (
            !event.wasClean &&
            this.reconnectAttempts < this.maxReconnectAttempts
          ) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = error => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    setTimeout(() => {
      if (this.ws?.readyState === WebSocket.CLOSED) {
        this.connect().catch(console.error);
      }
    }, delay);
  }

  private handleMessage(data: any): void {
    const { type, payload } = data;

    if (this.listeners.has(type)) {
      this.listeners.get(type)?.forEach(listener => {
        try {
          listener(payload);
        } catch (error) {
          console.error(`Error in listener for ${type}:`, error);
        }
      });
    }
  }

  subscribe<T>(type: string, listener: (data: T) => void): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }

    this.listeners.get(type)!.add(listener);

    return () => {
      this.listeners.get(type)?.delete(listener);
      if (this.listeners.get(type)?.size === 0) {
        this.listeners.delete(type);
      }
    };
  }

  send(type: string, payload: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('WebSocket not connected, message not sent:', {
        type,
        payload,
      });
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
  }
}
```

## 💾 Persistência e Compartilhamento

### Dashboard Persistence Manager

```typescript
// src/infrastructure/persistence/dashboard-persistence.ts
export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  layout: {
    widgets: Array<{
      id: string;
      type: string;
      position: { x: number; y: number; w: number; h: number };
      config: Record<string, any>;
    }>;
  };
  filters: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  tags: string[];
  version: number;
}

export class DashboardPersistenceManager {
  private static instance: DashboardPersistenceManager;
  private storageKey = 'healthcare-dashboards';
  private version = 1;

  static getInstance(): DashboardPersistenceManager {
    if (!DashboardPersistenceManager.instance) {
      DashboardPersistenceManager.instance = new DashboardPersistenceManager();
    }
    return DashboardPersistenceManager.instance;
  }

  async saveDashboard(
    layout: Omit<DashboardLayout, 'id' | 'createdAt' | 'updatedAt' | 'version'>
  ): Promise<string> {
    const id = crypto.randomUUID();
    const now = new Date();

    const dashboard: DashboardLayout = {
      ...layout,
      id,
      createdAt: now,
      updatedAt: now,
      version: this.version,
    };

    const existing = this.loadAllDashboards();
    existing.push(dashboard);

    localStorage.setItem(this.storageKey, JSON.stringify(existing));

    return id;
  }

  async updateDashboard(
    id: string,
    updates: Partial<DashboardLayout>
  ): Promise<void> {
    const dashboards = this.loadAllDashboards();
    const index = dashboards.findIndex(d => d.id === id);

    if (index === -1) {
      throw new Error(`Dashboard with id ${id} not found`);
    }

    dashboards[index] = {
      ...dashboards[index],
      ...updates,
      updatedAt: new Date(),
      version: this.version,
    };

    localStorage.setItem(this.storageKey, JSON.stringify(dashboards));
  }

  async deleteDashboard(id: string): Promise<void> {
    const dashboards = this.loadAllDashboards();
    const filtered = dashboards.filter(d => d.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }

  loadDashboard(id: string): DashboardLayout | null {
    const dashboards = this.loadAllDashboards();
    return dashboards.find(d => d.id === id) || null;
  }

  loadAllDashboards(): DashboardLayout[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];

      const dashboards = JSON.parse(stored);

      // Version migration
      return dashboards.map((dashboard: any) => {
        if (dashboard.version < this.version) {
          return this.migrateDashboard(dashboard);
        }
        return dashboard;
      });
    } catch (error) {
      console.error('Failed to load dashboards:', error);
      return [];
    }
  }

  private migrateDashboard(dashboard: any): DashboardLayout {
    // Handle version migrations here
    if (dashboard.version === 0) {
      return {
        ...dashboard,
        version: 1,
        tags: dashboard.tags || [],
        isPublic: dashboard.isPublic || false,
      };
    }

    return dashboard;
  }

  async exportDashboard(id: string): Promise<string> {
    const dashboard = this.loadDashboard(id);
    if (!dashboard) {
      throw new Error(`Dashboard with id ${id} not found`);
    }

    return JSON.stringify(dashboard, null, 2);
  }

  async importDashboard(jsonData: string): Promise<string> {
    try {
      const dashboard = JSON.parse(jsonData);

      // Validate structure
      if (!dashboard.name || !dashboard.layout) {
        throw new Error('Invalid dashboard format');
      }

      // Generate new ID and timestamps
      const { id, createdAt, updatedAt, ...rest } = dashboard;

      return await this.saveDashboard({
        ...rest,
        isPublic: false,
        tags: [],
      });
    } catch (error) {
      throw new Error(`Failed to import dashboard: ${error.message}`);
    }
  }

  async shareDashboard(
    id: string,
    isPublic: boolean,
    tags: string[]
  ): Promise<void> {
    await this.updateDashboard(id, { isPublic, tags });
  }

  searchDashboards(query: string, tags?: string[]): DashboardLayout[] {
    const dashboards = this.loadAllDashboards();

    return dashboards.filter(dashboard => {
      const matchesQuery =
        !query ||
        dashboard.name.toLowerCase().includes(query.toLowerCase()) ||
        dashboard.description?.toLowerCase().includes(query.toLowerCase());

      const matchesTags =
        !tags ||
        tags.length === 0 ||
        tags.some(tag => dashboard.tags.includes(tag));

      return matchesQuery && matchesTags;
    });
  }
}
```

## 📊 Monitoramento e Observabilidade

### Performance Monitor

```typescript
// src/infrastructure/monitoring/performance-monitor.ts
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ComponentPerformance {
  componentName: string;
  mountTime: number;
  renderTime: number;
  memoryUsage?: number;
  reRenderCount: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private componentMetrics: Map<string, ComponentPerformance> = new Map();
  private observers: Set<(metric: PerformanceMetric) => void> = new Set();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startComponentTimer(componentName: string): () => void {
    const startTime = performance.now();
    const startMemory = (performance as any).memory?.usedJSHeapSize;

    return () => {
      const endTime = performance.now();
      const endMemory = (performance as any).memory?.usedJSHeapSize;

      const mountTime = endTime - startTime;
      const memoryUsage =
        startMemory && endMemory ? endMemory - startMemory : undefined;

      this.recordComponentMetric(componentName, {
        componentName,
        mountTime,
        renderTime: mountTime,
        memoryUsage,
        reRenderCount: 0,
      });
    };
  }

  recordComponentMetric(
    componentName: string,
    metric: Partial<ComponentPerformance>
  ): void {
    const existing = this.componentMetrics.get(componentName);

    if (existing) {
      this.componentMetrics.set(componentName, {
        ...existing,
        ...metric,
        reRenderCount: existing.reRenderCount + 1,
      });
    } else {
      this.componentMetrics.set(componentName, {
        componentName,
        mountTime: 0,
        renderTime: 0,
        reRenderCount: 0,
        ...metric,
      });
    }
  }

  recordMetric(
    name: string,
    value: number,
    unit: string,
    metadata?: Record<string, any>
  ): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date(),
      metadata,
    };

    this.metrics.push(metric);

    // Notify observers
    this.observers.forEach(observer => {
      try {
        observer(metric);
      } catch (error) {
        console.error('Error in performance observer:', error);
      }
    });

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  getMetrics(
    name?: string,
    timeRange?: { start: Date; end: Date }
  ): PerformanceMetric[] {
    let filtered = this.metrics;

    if (name) {
      filtered = filtered.filter(m => m.name === name);
    }

    if (timeRange) {
      filtered = filtered.filter(
        m => m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
      );
    }

    return filtered;
  }

  getComponentMetrics(): ComponentPerformance[] {
    return Array.from(this.componentMetrics.values());
  }

  subscribe(observer: (metric: PerformanceMetric) => void): () => void {
    this.observers.add(observer);

    return () => {
      this.observers.delete(observer);
    };
  }

  generateReport(): {
    summary: Record<
      string,
      { avg: number; min: number; max: number; count: number }
    >;
    components: ComponentPerformance[];
    recommendations: string[];
  } {
    const summary: Record<
      string,
      { avg: number; min: number; max: number; count: number }
    > = {};

    // Group metrics by name
    const groupedMetrics = this.metrics.reduce(
      (acc, metric) => {
        if (!acc[metric.name]) {
          acc[metric.name] = [];
        }
        acc[metric.name].push(metric.value);
        return acc;
      },
      {} as Record<string, number[]>
    );

    // Calculate statistics
    Object.entries(groupedMetrics).forEach(([name, values]) => {
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);

      summary[name] = { avg, min, max, count: values.length };
    });

    // Generate recommendations
    const recommendations: string[] = [];

    if (summary['component-mount-time']?.avg > 100) {
      recommendations.push(
        'Component mount times are high. Consider code splitting or lazy loading.'
      );
    }

    if (summary['memory-usage']?.avg > 50 * 1024 * 1024) {
      recommendations.push(
        'Memory usage is high. Check for memory leaks in components.'
      );
    }

    return {
      summary,
      components: this.getComponentMetrics(),
      recommendations,
    };
  }
}
```

## 📊 Métricas de Qualidade

### Performance

- **Query Response Time**: <200ms para queries simples
- **Virtual Scrolling**: Suporte a 100k+ items
- **Memory Usage**: <200MB para uso intensivo
- **Bundle Size**: <1MB (gzipped)

### Funcionalidades

- **Query Builder**: 100% das operações implementadas
- **Notifications**: 99.9% de delivery rate
- **Persistence**: 100% de compatibilidade
- **Monitoring**: 100% de cobertura

## ✅ Checklist de Entrega

- [ ] Query builder visual implementado
- [ ] Preview de resultados em tempo real funcionando
- [ ] Virtual scrolling para listas grandes
- [ ] Lazy loading de módulos implementado
- [ ] Sistema de notificações WebSocket funcionando
- [ ] Centro de notificações implementado
- [ ] Sistema de persistência de dashboards
- [ ] Funcionalidades de compartilhamento
- [ ] Monitoramento de performance implementado
- [ ] Testes de performance criados
- [ ] Documentação de funcionalidades avançadas

## 🚀 Próximos Passos

Após completar esta fase, você terá:

1. Sistema de busca avançada completo
2. Performance otimizada para grandes volumes
3. Notificações em tempo real
4. Persistência e compartilhamento de dashboards
5. Monitoramento completo do sistema

**Tempo estimado**: 2-3 dias
**Complexidade**: Alta
**Dependências**: Phase 1, 2 e 3 completas
