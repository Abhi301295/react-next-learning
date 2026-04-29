'use client';

import React, { useState } from 'react';
import { TabProps } from './Tab';

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

  const tabsArray = React.Children.toArray(children) as React.ReactElement<TabProps>[];

  const handleClick = (index: number, disabled?: boolean) => {
    if (disabled) return;

    if (!isControlled) {
      setInternalIndex(index);
    }

    onTabChange?.(index);
  };

  return (
    <div className={className}>
      <div className="flex border-b gap-2 overflow-x-auto">
        {tabsArray.map((tab, index) => {
          const isActive = activeIndex === index;

          return (
            <button
              key={index}
              onClick={() => handleClick(index, tab.props.disabled)}
              disabled={tab.props.disabled}
              className={`px-4 py-2 whitespace-nowrap transition ${isActive
                  ? 'border-b-2 border-blue-500 font-semibold'
                  : 'text-gray-500 hover:text-black'
                } ${tab.props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {tab.props.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 relative overflow-hidden min-h-[50px]">
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