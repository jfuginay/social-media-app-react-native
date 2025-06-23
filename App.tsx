import Navigation from './navigation';
import { PhotoProvider, LocationProvider } from './services';

export default function App() {
  return (
    <LocationProvider>
      <PhotoProvider>
        <Navigation />
      </PhotoProvider>
    </LocationProvider>
  );
}
