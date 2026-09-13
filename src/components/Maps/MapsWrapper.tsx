import React, { 
  FunctionComponent, 
  PropsWithChildren, 
  ReactNode 
} from 'react';
import { 
  APIProvider, 
  useApiLoadingStatus, 
  APILoadingStatus, 
  APIProviderProps 
} from '@vis.gl/react-google-maps';

const statusMap: Record<APILoadingStatus, 'LOADING' | 'SUCCESS' | 'FAILURE'> = {
  [APILoadingStatus.NOT_LOADED]: 'LOADING',
  [APILoadingStatus.LOADING]: 'LOADING',
  [APILoadingStatus.LOADED]: 'SUCCESS',
  [APILoadingStatus.FAILED]: 'FAILURE',
  [APILoadingStatus.AUTH_FAILURE]: 'FAILURE'
};

type WrapperProps = PropsWithChildren<
  {
    apiKey: string;
    render?: (status: 'LOADING' | 'SUCCESS' | 'FAILURE') => ReactNode;
  } & APIProviderProps
>;

export const MapsWrapper: FunctionComponent<WrapperProps> = ({
  apiKey,
  children,
  render,
  ...apiProps
}) => {
  if (!apiKey || apiKey.trim() === '') {
    return <>{children}</>;
  }

  return (
    <APIProvider 
      apiKey={apiKey} 
      {...apiProps}
    >
      <InnerWrapper render={render}>{children}</InnerWrapper>
    </APIProvider>
  );
};

const InnerWrapper = ({
  render,
  children
}: PropsWithChildren<Omit<WrapperProps, 'apiKey'>>) => {
  const status = useApiLoadingStatus();
  const mappedStatus = statusMap[status];

  // If we have a render function and we are not successfully loaded,
  // we let the render function decide what to show.
  // But if the render function returns null/undefined, we might still want to show children
  // if they are not map-dependent.
  // For this app, we want the main UI to show up regardless.
  
  if (status === APILoadingStatus.LOADED) {
    return <>{children}</>;
  }

  if (render) {
    const rendered = render(mappedStatus);
    if (rendered !== null) {
      return <>{rendered}</>;
    }
  }

  // Fallback: always show children so the app doesn't go blank
  return <>{children}</>;
};
