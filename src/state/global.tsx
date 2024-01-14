'use client';

import React, {createContext, useState} from "react";
import {MyHand, UnknownCard} from "@/model/card";

export type GlobalState = {
    gameSetting: GameSetting,
    initialHandState: InitialHandState,
}

export type GameSetting = {
    playerAmount: number,
    setPlayerAmount: (playerAmount:number) => void,
    myOrder: number | null,
    setMyOrder: (myOrder:number) => void,
}

export type InitialHandState = {
    myHand: MyHand | null,
    setMyHand: (myHand:MyHand) => void,
    othersHand: Array<Array<UnknownCard>>,
    setOthersHand: (othersHand: Array<Array<UnknownCard>>) => void,
    pushOtherHand: (otherHand: Array<UnknownCard>) => void,
}

export const GlobalContext = createContext<GlobalState>({} as GlobalState);

export default function GlobalContextProvider({children}:{children:React.ReactNode}) {
    const [playerAmount, setPlayerAmount] = useState<number|null>(null)
    const [myOrder, setMyOrder] = useState<number|null>(null)

    const [myHand, setMyHand] = useState<MyHand|null>(null)
    const [othersHand, setOthersHand] = useState<Array<Array<UnknownCard>>>(new Array<Array<UnknownCard>>())

    const initialState: GlobalState = {
        gameSetting: {
            playerAmount: playerAmount,
            setPlayerAmount: setPlayerAmount,
            myOrder: myOrder,
            setMyOrder: setMyOrder,
        },
        initialHandState: {
            myHand: myHand,
            setMyHand: setMyHand,
            othersHand: othersHand,
            setOthersHand: setOthersHand,
            pushOtherHand: (otherHand: Array<UnknownCard>) => {
                const nextOthersHand = [...othersHand!!, otherHand]
                setOthersHand(nextOthersHand)
            },
        }

    };
    return (
        <GlobalContext.Provider value={initialState}>
            {children}
        </GlobalContext.Provider>
    );
}
