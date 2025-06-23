import { Provider } from 'react-redux';
import Navigation from './navigation';
import { PhotoProvider, LocationProvider } from './services';
import { store } from './store';

export default function App() {
  return (
    <Provider store={store}>
      <LocationProvider>
        <PhotoProvider>
          <Navigation />
        </PhotoProvider>
      </LocationProvider>
    </Provider>
  );
}
