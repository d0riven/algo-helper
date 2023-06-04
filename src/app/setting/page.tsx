'use client';

import {ChangeEvent, ChangeEventHandler, ReactNode, useContext, useState} from "react";
import {GlobalContext} from "@/state/global";
import {Simulate} from "react-dom/test-utils";
import play = Simulate.play;
import {CARD_NUMBERS} from "@/utils/constans";
import {CardColors} from "@/model/colors";

export default function Setting() {
    const global = useContext(GlobalContext);
    const playerAmount = global.gameSetting.playerAmount!!
    const myOrder = global.gameSetting.myOrder!!

    const undefinedNumber = '?'

    const [blackSelectedNumber, setBlackSelectedNumber] = useState<Array<number>>([])
    const [whiteSelectedNumber, setWhiteSelectedNumber] = useState<Array<number>>([])

    // すでに選択済みの 色 * カード番号 を除外したselect項目を生成する
    const generateSelectNumber = ():ReactNode[] => {
        let numbers = CARD_NUMBERS.filter(v => {
            switch (selectColor) {
                case CardColors.Black:
                    return !blackSelectedNumber.includes(v)
                case CardColors.White:
                    return !whiteSelectedNumber.includes(v)
            }
        })
        let nodes = numbers.map((v):ReactNode => {return (<option key={v}>{v}</option>)})
        nodes.unshift(<option key={'undefined'}>{undefinedNumber}</option>)
        return nodes
    }

    const [selectNumber, setSelectNumber] = useState<number|null>(null)
    const handleSelectNumber = (e:ChangeEvent<HTMLSelectElement>) => {
        const v = e.target.value
        if (v == undefinedNumber) {
            return
        }
        setSelectNumber(parseInt(v))
    }

    const [selectColor, setSelectColor] = useState<string>(CardColors.Black)
    const handleSelectColor = (e:ChangeEvent<HTMLSelectElement>) => {
        switch (e.target.value) {
            case CardColors.Black:
                setSelectColor(CardColors.Black)
                break
            case CardColors.White:
                setSelectColor(CardColors.White)
                break
        }
    }

    const handleNextCard = () => {
        if (!selectNumber) {
            window.alert("数を選んでください")
            return
        }
        switch (selectColor) {
            case CardColors.Black:
                setBlackSelectedNumber(blackSelectedNumber.concat(selectNumber))
                break
            case CardColors.White:
                setWhiteSelectedNumber(whiteSelectedNumber.concat(selectNumber))
                break
        }
        setSelectColor(CardColors.Black)
        setSelectNumber(null)
    }

    return (
        <>
            <p>player amount: {playerAmount}</p>
            <p>my order: {myOrder}</p>
            <div>
                <label>色</label>
                <select value={selectColor} onChange={handleSelectColor}>
                    <option color="black" value={CardColors.Black}>●</option>
                    <option color="white" value={CardColors.White}>◯</option>
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
                onClick={handleNextCard}>確定</button>
        </>
    );
}
