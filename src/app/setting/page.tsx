'use client';

import {ChangeEvent, ReactNode, useContext, useState} from "react";
import {GlobalContext} from "@/state/global";
import {CARD_NUMBERS} from "@/utils/constans";
import {Card, CardColor, MyHand} from "@/model/card";

export default function Setting() {
    const global = useContext(GlobalContext);
    const playerAmount = global.gameSetting.playerAmount!!
    const myOrder = global.gameSetting.myOrder!!

    const undefinedNumber = '?'

    const [myHandCards, setMyHandCards] = useState<Array<Card>>([])
    const [blackSelectedNumber, setBlackSelectedNumber] = useState<Array<number>>([])
    const [whiteSelectedNumber, setWhiteSelectedNumber] = useState<Array<number>>([])

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
            return (<option key={v}>{v}</option>)
        })
        nodes.unshift(<option key={'undefined'}>{undefinedNumber}</option>)
        return nodes
    }

    const [selectNumber, setSelectNumber] = useState<number | null>(null)
    const handleSelectNumber = (e: ChangeEvent<HTMLSelectElement>) => {
        const v = e.target.value
        if (v == undefinedNumber) {
            return
        }
        setSelectNumber(parseInt(v))
    }

    const [selectColor, setSelectColor] = useState<string>(CardColor.black)
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

    const handleNextCard = () => {
        if (!selectNumber) {
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
        const card = new Card(selectNumber, CardColor[selectColor])

        setSelectColor(CardColor.black)
        setSelectNumber(null)
        setMyHandCards(myHandCards.concat(card))
    }

    const generateHandCards = () => {
        const myHand = new MyHand(myHandCards)
        const nodes = myHand.sortedCard.map((v) => {
            return (<div
                key={v.key}
                // @see https://stackoverflow.com/questions/72481680/tailwinds-background-color-is-not-being-applied-when-added-dynamically
                // 以下のようにclassNameでtailwindを使って背景色を指定できなかったので、styleを指定するようにしている
                // className={`${v.bgColor} ${v.textColor}`}
                style={{
                    color: v.textColor,
                    backgroundColor: v.bgColor,
                    border: v.border,
                }}
            >{v.number}</div>)
        })
        return (
            <div className="flex flex-row">
                {nodes}
            </div>
        )
    }

    return (
        <>
            <p>player amount: {playerAmount}</p>
            <p>my order: {myOrder}</p>
            <div>
                <label>色</label>
                <select value={selectColor} onChange={handleSelectColor}>
                    <option value={CardColor.black}>●</option>
                    <option value={CardColor.white}>◯</option>
                </select>
            </div>
            <div>
                <label>番号</label>
                <select value={selectNumber ?? undefinedNumber} onChange={handleSelectNumber}>
                    {generateSelectNumber()}
                </select>
            </div>
            <button
                className='rounded-full bg-sky-500 hover:bg-sky-700 px-4'
                onClick={handleNextCard}>確定
            </button>
            <hr/>
            {generateHandCards()}
        </>
    );
}
