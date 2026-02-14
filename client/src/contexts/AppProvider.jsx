import { BrowserRouter as Router } from 'react-router-dom';
import { FetcherProvider } from './Fetcher/FetcherProvider';


export const AppProvider = ({ children }) => {
  return (
    <Router>
      {children}
    </Router>
  )
}
