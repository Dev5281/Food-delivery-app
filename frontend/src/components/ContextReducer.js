import React, { createContext, useContext, useReducer } from "react";

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      let newState = [...state, {
        id: action.id,
        name: action.name,
        price:parseFloat (action.price)||0,
        qty: action.qty,
        size: action.size
    }];
    console.log("Updated Cart State:", newState);
    return newState;
    case "REMOVE":
      let newArr = [...state]
      newArr.splice(action.index,1)
      return newArr;
      case "UPDATE":
        return state.map(item =>
          item.id === action.id && item.size === action.size
            ? { ...item, qty: action.qty, price: action.price }
            : item
        );
    case "DROP":
      return [];

    default:
      console.log("error in reducer");
      return state;
  }
};
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, []);
  return (
    
      <CartStateContext.Provider value={state}>
        <CartDispatchContext.Provider value={dispatch}>
        {children};
        </CartDispatchContext.Provider>
      </CartStateContext.Provider>
    
  );
};

export const UseCart = () => useContext(CartStateContext);
export const UseDispatchCart = () => useContext(CartDispatchContext);
