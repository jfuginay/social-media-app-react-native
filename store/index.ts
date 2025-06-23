import { configureStore } from '@reduxjs/toolkit';
import contactsReducer from './contactsSlice';

export const store = configureStore({
  reducer: {
    contacts: contactsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['contacts/updateContactLocation', 'contacts/setContactOnlineStatus'],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['payload.lastSeen'],
        // Ignore these paths in the state
        ignoredPaths: ['contacts.contacts.lastSeen'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 