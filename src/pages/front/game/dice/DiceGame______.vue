<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  name: 'DiceGame',
})
export default class DiceGame extends Vue {
  private numDice = 1; // 던질 주사위 횟수를 설정하세요.
  private rollDice(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  private playGame(numDice: number): number[] {
    const diceResults: number[] = [];

    for (let i = 0; i < numDice; i++) {
      diceResults.push(this.rollDice());
    }

    return diceResults;
  }
  mounted() {
    this.playGame(this.numDice);
  }
}
</script>
<template>
  <div>{{ playGame(numDice) }}</div>
</template>
