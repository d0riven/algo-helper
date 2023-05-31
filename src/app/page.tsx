'use client';

import Image from 'next/image'
import React, { useState } from 'react';
import {Simulate} from "react-dom/test-utils";
import play = Simulate.play;

export default function Top() {
  const [playerAmount, setPlayerAmount] = useState<number>(2);
  const [yourNumber, setYourNumber] = useState<number|null>(null);
  const handlePlayerAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value);
    value = value > 2 ? value : 2; // lower:2
    value = value < 4 ? value : 4; // upper:4
    setPlayerAmount(value);
    setYourNumber(1);
  };

  const generateSelector = (): React.ReactNode[] => {
    let options = Array<React.ReactNode>();
    for (let i = 1; i <= playerAmount; i++) {
      options.push(
          <option key={i} value={i}>{i}</option>
      );
    }
    return options;
  }

  return (
    <main className='container mx-auto'>
      <div className="flex">
        <div className="flex-col justify-center">
          <h1>Algo Helper</h1>
          <div>
            <label>プレイヤー数</label>
            <input
                type='number'
                value={playerAmount}
                onChange={handlePlayerAmount}/>
          </div>
          <div>
            <label>あなたは何番目</label>
            <select id='your-no'>
              {generateSelector()}
            </select>
          </div>
          <button className='rounded-full bg-sky-500 hover:bg-sky-700 px-4'>開始</button>
        </div>
      </div>
    </main>
  )
}
