'use client';

import {useContext} from "react";
import {GlobalContext} from "@/state/global";

export default function Setting() {
    const global = useContext(GlobalContext);
    return (
        <>
            <p>playerAmount: {global.gameSetting.playerAmount}</p>
            <p>myOrder: {global.gameSetting.myOrder}</p>
        </>
    );
}
