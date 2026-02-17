import { FetcherProvider } from './Fetcher/FetcherProvider';


export const AppProvider = ({ children }) => {
  return (
    <FetcherProvider>
      {children}
    </FetcherProvider>
  )
}
