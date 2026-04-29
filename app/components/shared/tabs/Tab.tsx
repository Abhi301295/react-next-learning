'use client';

export interface TabProps {
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const Tab = ({ children }: TabProps) => {
  return <>{children}</>;
};

export default Tab;