import React, { PropsWithChildren, ReactNode } from 'react';

type WrapperProps = PropsWithChildren<{
  apiKey?: string;
  render?: (status: 'LOADING' | 'SUCCESS' | 'FAILURE') => ReactNode;
}>;

export const MapsWrapper: React.FC<WrapperProps> = ({ 
  children,
  render
}) => {
  return (
    <>
      {children}
    </>
  );
};

