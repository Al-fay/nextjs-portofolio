"use client";

import React from "react";
import {
  IconAtom,
  IconBraces,
  IconStack2Filled,
  IconFlame,
  IconWind,
  IconSparkles,
  IconDatabase,
  IconServer,
  IconBolt,
  IconCloud,
  IconCpu,
  IconContainer,
  IconCloudBolt,
  IconSend,
  IconFileCode,
} from "@tabler/icons-react";
import type { TablerIcon } from "@tabler/icons-react";

interface TechIconProps {
  name: string;
  className?: string;
}

const ICONS: Record<string, TablerIcon> = {
  CodeReact: IconAtom,
  TypeScript: IconBraces,
  TanStack: IconStack2Filled,
  Svelte: IconFlame,
  Tailwind: IconWind,
  Sparkles: IconSparkles,
  Database: IconDatabase,
  Server: IconServer,
  Zap: IconBolt,
  Cloud: IconCloud,
  Cpu: IconCpu,
  Container: IconContainer,
  CloudLightning: IconCloudBolt,
  Send: IconSend,
};

export const TechIcon: React.FC<TechIconProps> = ({
  name,
  className = "w-6 h-6",
}) => {
  const Icon = ICONS[name];

  if (!Icon) {
    return (
      <IconFileCode
        className={className}
        id="icon-fallback"
        aria-hidden="true"
      />
    );
  }

  return (
    <Icon
      className={className}
      id={`icon-${name.toLowerCase()}`}
      aria-hidden="true"
    />
  );
};
