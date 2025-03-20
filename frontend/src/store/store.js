  import { configureStore } from '@reduxjs/toolkit';
  import { persistStore, persistReducer } from 'redux-persist';
  import storageSession from 'redux-persist/lib/storage/session'; // use sessionStorage instead of localStorage
  import userReducer from './user';
  import loadingSlice from './isload';
  import socketslice from "./notifysocketSlice"
  import groupSlice from './group';
import bucketslice from './bucket';
  // Persist config for user slice with sessionStorage
  const userPersistConfig = {
    key: 'user',
    storage: storageSession,
  };

  // Persist config for action button


  // Wrap reducers with persistReducer
  const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

  const store = configureStore({
    reducer: {

      user: persistedUserReducer, // Persistent user state using session storage
      loading: loadingSlice.reducer, // Non-persistent loading state
      group: groupSlice.reducer, // Persistent group state
      socket:socketslice,
      bucket:bucketslice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE','socket.socket'],
        },
      })
  });

  export const persistor = persistStore(store);

  export default store;
