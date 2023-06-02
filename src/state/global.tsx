'use client';

import React, {createContext} from "react";

export type GlobalState = {
    gameSetting: GameSetting,
}

export type GameSetting = {
    playerAmount: number | null,
    myOrder: number | null,
}

export const GlobalContext = createContext<GlobalState>({} as GlobalState);


export default function GlobalContextProvider({children}:{children:React.ReactNode}) {
    const initialState: GlobalState = {
        gameSetting: {
            playerAmount: null,
            myOrder: null,
        }
    };
    return (
        <GlobalContext.Provider value={initialState}>
            {children}
        </GlobalContext.Provider>
    );
}
