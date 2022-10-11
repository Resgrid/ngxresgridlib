export interface ICacheable {
  cacheKey: string;
  cacheTime: number;
  cacheSavedOn: Date | undefined;
  cacheHitFailed: boolean;
  cacheType: number; // 0 = none, 1 = primary (before), 2 = fallback (on error)
}