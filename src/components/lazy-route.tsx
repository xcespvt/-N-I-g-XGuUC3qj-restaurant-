'use client';

import { useEffect, useState, Suspense, lazy, ComponentType } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

type LazyRouteProps = {
  fallback?: React.ReactNode;
  components: {
    [key: string]: () => Promise<{ default: ComponentType<any> }>;
  };
};

export function LazyRoute({ fallback, components }: LazyRouteProps) {
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const loadComponent = async () => {
      const path = pathname.split('/').filter(Boolean)[0] || 'dashboard';
      const componentLoader = components[path];
      
      if (!componentLoader) {
        console.error(`No component found for path: ${path}`);
        return;
      }

      try {
        setIsLoading(true);
        const module = await componentLoader();
        setComponent(() => module.default);
      } catch (error) {
        console.error(`Error loading component for ${path}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadComponent();
  }, [pathname, searchParams, components]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!Component) return fallback || null;

  return (
    <Suspense fallback={fallback || <div>Loading...</div>}>
      <Component />
    </Suspense>
  );
}
