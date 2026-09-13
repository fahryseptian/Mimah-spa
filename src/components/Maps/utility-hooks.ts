import {
  DependencyList,
  EffectCallback,
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import isDeepEqual from 'fast-deep-equal';

export function useCallbackRef<T>() {
  const [el, setEl] = useState<T | null>(null);
  const ref = useCallback((value: T) => setEl(value), [setEl]);
  return [el, ref as Ref<T>] as const;
}

export function useDeepCompareEffect(
  effect: EffectCallback,
  deps: DependencyList
) {
  const ref = useRef<DependencyList | undefined>(undefined);
  if (!ref.current || !isDeepEqual(deps, ref.current)) {
    ref.current = deps;
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, ref.current);
}

export function useDomEventListener<T extends (...args: any[]) => void>(
  target?: Node | null,
  name?: string,
  callback?: T | null
) {
  useEffect(() => {
    if (!target || !name || !callback) return;
    target.addEventListener(name, callback);
    return () => target.removeEventListener(name, callback);
  }, [target, name, callback]);
}

export function usePropBinding<T extends object, K extends keyof T>(
  object: T | null,
  prop: K,
  value: any
) {
  useEffect(() => {
    if (!object) return;
    (object[prop] as any) = value;
  }, [object, prop, value]);
}
