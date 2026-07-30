import {
  HomeDiscoveryStaleNotice,
  HomeDiscoveryState,
  type HomeDiscoveryStateCopy,
  type HomeDiscoveryStateProps,
  type HomeDiscoveryStateVariant,
} from "@/features/discovery/components/home-discovery-state";

export type PopularAuthorsStateCopy = HomeDiscoveryStateCopy;
export type PopularAuthorsStateVariant = HomeDiscoveryStateVariant;
export type PopularAuthorsStateProps = HomeDiscoveryStateProps;

export function PopularAuthorsState(props: PopularAuthorsStateProps) {
  return <HomeDiscoveryState {...props} />;
}

export function PopularAuthorsStaleNotice({
  copy,
  className,
}: {
  copy: PopularAuthorsStateCopy;
  className?: string | undefined;
}) {
  return <HomeDiscoveryStaleNotice className={className} copy={copy} />;
}