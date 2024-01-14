'use client';

import {ChangeEvent, useContext, useState} from "react";
import {GlobalContext} from "@/state/global";
import {CardColor, OtherHand, UndefinedNumber, UnknownCard} from "@/model/card";
import {useRouter} from "next/navigation";

export default function SettingOther({params}: { params: { order: string } }) {
    // TODO: Cookieに保存した値を読み取れるようにする
    const global = useContext(GlobalContext)
    const router = useRouter();

    const rawOrder = params.order
    const order = parseInt(rawOrder ?? '1')
    if (Number.isNaN(order)) {
        console.log('パスパラメータが整数ではない', rawOrder)
        router.back()
    }

    if (order >= global.gameSetting.playerAmount) {
        router.replace('/setting/hand/complete')
    }

    const playerAmount = global.gameSetting.playerAmount!!

    const [selectColor, setSelectColor] = useState<string>(CardColor.black)
    const [otherHandCards, setOtherHandCards] = useState<Array<UnknownCard>>([])

    const nextOtherPlayerSetting = () => {
        global.initialHandState.pushOtherHand(otherHandCards)
        router.push(`/setting/hand/other/${order+1}`)
    }

    const handleSelectColor = (e: ChangeEvent<HTMLSelectElement>) => {
        switch (e.target.value) {
            case CardColor.black:
                setSelectColor(CardColor.black)
                break
            case CardColor.white:
                setSelectColor(CardColor.white)
                break
        }
    }

    const generateOtherHandCards = () => {
        const otherHand = new OtherHand(otherHandCards)
        return otherHand.cards.map((v, i) => {
            return (<span
                key={i}
                // @see https://stackoverflow.com/questions/72481680/tailwinds-background-color-is-not-being-applied-when-added-dynamically
                // 以下のようにclassNameでtailwindを使って背景色を指定できなかったので、styleを指定するようにしている
                // className={`${v.bgColor} ${v.textColor}`}
                style={{
                    color: v.textColor,
                    backgroundColor: v.bgColor,
                    border: v.border,
                }}
            >{UndefinedNumber}</span>)
        })
    }
    const handleNextOtherHandCard = () => {
        const color = selectColor == CardColor.black ? CardColor.black : CardColor.white
        const card = new UnknownCard(color)
        const nextOtherHand = otherHandCards.concat(card)

        setOtherHandCards(nextOtherHand)
        setSelectColor(CardColor.black)
    }

    // other player hand input
    return (
        <>
            <p>player amount: {playerAmount}</p>
            <p>current order: {order}</p>
            <div>
                <label>色</label>
                <select value={selectColor} onChange={handleSelectColor}>
                    <option value={CardColor.black}>●</option>
                    <option value={CardColor.white}>◯</option>
                </select>
            </div>
            <button
                className='rounded-full bg-sky-500 hover:bg-sky-700 px-4'
                onClick={handleNextOtherHandCard}>確定
            </button>
            <hr/>
            <div>
                {generateOtherHandCards()}
            </div>
        </>
    );
}
