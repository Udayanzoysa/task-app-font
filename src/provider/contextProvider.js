import { createContext, useState } from "react";

export const StoreContext = createContext();

const ContextProvider = ({ children }) => {
  const [store, setStore] = useState({});

  const setValue = ({ path, data }) => {
    setStore({ ...store, [path]: data });
  };

  const getValue = (path) => {
    return store[path];
  };

  return (
    <StoreContext.Provider value={{ getValue, setValue }}>
      {children}
    </StoreContext.Provider>
  );
};

export default ContextProvider;
