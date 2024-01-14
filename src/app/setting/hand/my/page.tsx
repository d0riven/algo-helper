'use client';

import {ChangeEvent, ReactNode, useContext, useState} from "react";
import {CARD_NUMBERS} from "@/utils/constans";
import {Card, CardColor, MyHand, UndefinedNumber} from "@/model/card";
import {useRouter} from "next/navigation";
import {GlobalContext} from "@/state/global";

export default function SettingMy() {
    const global = useContext(GlobalContext);

    const [selectNumber, setSelectNumber] = useState<number | null>(null)
    const [selectColor, setSelectColor] = useState<string>(CardColor.black)
    const [myHandCards, setMyHandCards] = useState<Array<Card>>([])
    const [blackSelectedNumber, setBlackSelectedNumber] = useState<Array<number>>([])
    const [whiteSelectedNumber, setWhiteSelectedNumber] = useState<Array<number>>([])

    const router = useRouter();

    const goOtherHandSetting = () => {
        global.initialHandState.setMyHand(new MyHand(myHandCards))
        router.push('/setting/hand/other');
    }

    const handleSelectNumber = (e: ChangeEvent<HTMLSelectElement>) => {
        const v = e.target.value
        if (v == UndefinedNumber) {
            return
        }
        setSelectNumber(parseInt(v))
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

    const handleNextMyHandCard = () => {
        if (selectNumber === null) {
            window.alert("数を選んでください")
            return
        }
        switch (selectColor) {
            case CardColor.black:
                setBlackSelectedNumber(blackSelectedNumber.concat(selectNumber))
                break
            case CardColor.white:
                setWhiteSelectedNumber(whiteSelectedNumber.concat(selectNumber))
                break
        }
        const color = selectColor == CardColor.black ? CardColor.black : CardColor.white
        const card = new Card(selectNumber, color)
        const nextMyHand = myHandCards.concat(card)

        setSelectColor(CardColor.black)
        setSelectNumber(null)
        setMyHandCards(nextMyHand)

        if (nextMyHand.length >= 4) {
            goOtherHandSetting()
        }
    }

    // すでに選択済みの 色 * カード番号 を除外したselect項目を生成する
    const generateSelectNumber = (): ReactNode[] => {
        let numbers = CARD_NUMBERS.filter(v => {
            switch (selectColor) {
                case CardColor.black:
                    return !blackSelectedNumber.includes(v)
                case CardColor.white:
                    return !whiteSelectedNumber.includes(v)
            }
        })
        let nodes = numbers.map((v): ReactNode => {
            return (<option key={v} value={v}>{v}</option>)
        })
        nodes.unshift(<option key={'undefined'}>{UndefinedNumber}</option>)
        return nodes
    }


    const generateMyHandCards = () => {
        const myHand = new MyHand(myHandCards)
        return myHand.sortedCards.map((v) => {
            return (<span
                key={v.key}
                // @see https://stackoverflow.com/questions/72481680/tailwinds-background-color-is-not-being-applied-when-added-dynamically
                // 以下のようにclassNameでtailwindを使って背景色を指定できなかったので、styleを指定するようにしている
                // className={`${v.bgColor} ${v.textColor}`}
                style={{
                    color: v.textColor,
                    backgroundColor: v.bgColor,
                    border: v.border,
                }}
            >{v.number}</span>)
        })
    }

    return (
        <>
            <div>
                <label>色</label>
                <select value={selectColor} onChange={handleSelectColor}>
                    <option value={CardColor.black}>●</option>
                    <option value={CardColor.white}>◯</option>
                </select>
            </div>
            <div>
                <label>番号</label>
                <select value={selectNumber ?? UndefinedNumber} onChange={handleSelectNumber}>
                    {generateSelectNumber()}
                </select>
            </div>
            <button
                className='rounded-full bg-sky-500 hover:bg-sky-700 px-4'
                onClick={handleNextMyHandCard}>確定
            </button>
            <hr/>
            <div>
                {generateMyHandCards()}
            </div>
        </>
    );
}
