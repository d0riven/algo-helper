'use client';

import {ChangeEvent, ReactNode, useContext, useState} from "react";
import {GlobalContext} from "@/state/global";
import {CARD_NUMBERS} from "@/utils/constans";
import {Card, CardColor, MyHand, OtherHand, UnknownCard} from "@/model/card";

export default function Setting() {
    const global = useContext(GlobalContext)
    // TODO: Cookieに保存した値を読み取れるようにする
    global.gameSetting.myOrder = 1
    global.gameSetting.playerAmount = 4

    const playerAmount = global.gameSetting.playerAmount!!
    const myOrder = global.gameSetting.myOrder!!

    const undefinedNumber = '?'

    const [currentOrder , setCurrentOrder] = useState<number>(1)
    const [myHandCards, setMyHandCards] = useState<Array<Card>>([])
    const [otherHandCards, setOtherHandCards] = useState<Array<UnknownCard>>([])
    const [otherPlayersHandCards, setOtherPlayersHandCards] = useState<Array<Array<UnknownCard>>>(new Array([]))
    const [blackSelectedNumber, setBlackSelectedNumber] = useState<Array<number>>([])
    const [whiteSelectedNumber, setWhiteSelectedNumber] = useState<Array<number>>([])

    const nextPlayerSetting = () => {
        setCurrentOrder(currentOrder+1)
        setBlackSelectedNumber([])
        setWhiteSelectedNumber([])
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
            nextPlayerSetting()
        }
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

    if (currentOrder > playerAmount) {
        // TODO: ここに入力したカード情報を表示させて、次の画面へのボタンを表示
        return (
            <>
                <p>player amount: {playerAmount}</p>
                <p>my order: {myOrder}</p>
                <p>current order: {currentOrder}</p>
            </>
        )
    }

    // my hand input
    if (currentOrder == myOrder) {
        return (
            <>
                <p>player amount: {playerAmount}</p>
                <p>my order: {myOrder}</p>
                <p>current order: {currentOrder}</p>
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
                    onClick={handleNextMyHandCard}>確定
                </button>
                <hr/>
                <div>
                    {generateMyHandCards()}
                </div>
            </>
        );
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
            >{undefinedNumber}</span>)
        })
    }
    const handleNextOtherHandCard = () => {
        const color = selectColor == CardColor.black ? CardColor.black : CardColor.white
        const card = new UnknownCard(color)
        const nextOtherHand = otherHandCards.concat(card)

        setSelectColor(CardColor.black)
        setOtherHandCards(nextOtherHand)

        if (nextOtherHand.length >= 4) {
            nextPlayerSetting()
            setOtherHandCards([])
            setOtherPlayersHandCards(otherPlayersHandCards.concat(nextOtherHand))
        }
    }

    // other player hand input
    return (
        <>
            <p>player amount: {playerAmount}</p>
            <p>my order: {myOrder}</p>
            <p>current order: {currentOrder}</p>
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
