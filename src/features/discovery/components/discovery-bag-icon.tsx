"use client";

import BagFillIcon from "@iconify-react/lets-icons/bag-fill";

type DiscoveryBagIconProps = {
  className?: string;
};

export function DiscoveryBagIcon({ className }: DiscoveryBagIconProps) {
  return <BagFillIcon aria-hidden="true" className={className} />;
}