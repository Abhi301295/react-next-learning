'use client';

import React, { useId, useMemo, useState } from 'react';
import type { TabProps } from './Tab';

interface TabsProps {
  children: React.ReactNode;
  defaultIndex?: number;
  selectedIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
}

const Tabs = ({
  children,
  defaultIndex = 0,
  selectedIndex,
  onTabChange,
  className = ''
}: TabsProps) => {

  const [internalIndex, setInternalIndex] = useState(defaultIndex);

  const isControlled = selectedIndex !== undefined;
  const activeIndex = isControlled ? selectedIndex : internalIndex;

  const tabsArray = useMemo(
    () => React.Children.toArray(children) as React.ReactElement<TabProps>[],
    [children]
  );
  const baseId = useId();

  const activateTab = (index: number) => {
    const tab = tabsArray[index];
    if (!tab || tab.props.disabled) return;

    if (!isControlled) {
      setInternalIndex(index);
    }

    onTabChange?.(index);
  };

  const handleClick = (index: number, disabled?: boolean) => {
    if (disabled) return;
    activateTab(index);
  };

  return (
    <div className={className}>
      <div className="flex gap-2 overflow-x-auto border-b border-stroke" role="tablist" aria-label="Tabs">
        {tabsArray.map((tab, index) => {
          const isActive = activeIndex === index;
          const tabId = `${baseId}-tab-${index}`;
          const panelId = `${baseId}-panel-${index}`;

          const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
            const enabledIndexes = tabsArray
              .map((t, i) => (t.props.disabled ? -1 : i))
              .filter((i) => i >= 0);
            const enabledPos = enabledIndexes.indexOf(index);
            if (enabledPos === -1) return;

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
              e.preventDefault();
              const next = enabledIndexes[(enabledPos + 1) % enabledIndexes.length];
              activateTab(next);
              document.getElementById(`${baseId}-tab-${next}`)?.focus();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
              e.preventDefault();
              const prev =
                enabledIndexes[(enabledPos - 1 + enabledIndexes.length) % enabledIndexes.length];
              activateTab(prev);
              document.getElementById(`${baseId}-tab-${prev}`)?.focus();
            } else if (e.key === 'Home') {
              e.preventDefault();
              const first = enabledIndexes[0];
              activateTab(first);
              document.getElementById(`${baseId}-tab-${first}`)?.focus();
            } else if (e.key === 'End') {
              e.preventDefault();
              const last = enabledIndexes[enabledIndexes.length - 1];
              activateTab(last);
              document.getElementById(`${baseId}-tab-${last}`)?.focus();
            }
          };

          return (
            <button
              key={tabId}
              id={tabId}
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleClick(index, tab.props.disabled)}
              onKeyDown={handleKeyDown}
              disabled={tab.props.disabled}
              className={`px-4 py-2 whitespace-nowrap transition ${isActive
                  ? 'border-b-2 border-blue-500 font-semibold'
                  : 'text-subtle hover:text-foreground'
                } ${tab.props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {tab.props.label}
            </button>
          );
        })}
      </div>

      <div
        id={`${baseId}-panel-${activeIndex}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${activeIndex}`}
        className="mt-4 relative overflow-hidden min-h-[50px]"
      >
        <div
          key={activeIndex}
          className="animate-fade-slide"
        >
          {tabsArray[activeIndex] ?? null}
        </div>
      </div>

    </div>
  );
};

export default Tabs;