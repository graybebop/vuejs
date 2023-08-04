<template>
  <div>{{ results }}</div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

class DiceGame {
  rollDice(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  playGame(numDice: number): number[] {
    const diceResults: number[] = [];

    for (let i = 0; i < numDice; i++) {
      diceResults.push(this.rollDice());
    }

    return diceResults;
  }
}

const myDiceGame = new DiceGame();
const numDice = 1; // 던질 주사위 횟수를 설정하세요.

export default class App extends Vue {
  results = myDiceGame.playGame(numDice);
}
</script>
