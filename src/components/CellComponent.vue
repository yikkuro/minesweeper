<template>
  <v-btn
    @click.left="click"
    @click.right.prevent="rightClickHandler"
    ref="mainBtn"
    flat
    class="cell grey lighten-2"
    :class="statusClass()"
  >
    {{innerText()}}
    <v-icon color="error" v-if="modelLocal().flagged" small>fas fa-flag-checkered</v-icon>
  </v-btn>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { CellStatus, CellModel } from '@/model/CellModel';
@Component({})
export default class CellComponent extends Vue {
  @Prop() public model?: CellModel;
  constructor() {
    super();
  }
  public modelLocal(): CellModel {
    return this.model!;
  }

  @Watch('model.triggeredClick') public triggerClick() {
    const mainBtn = this.$refs.mainBtn as any;
    if (this.modelLocal().status !== CellStatus.Clicked && this.modelLocal().triggeredClick !== 0) {
      this.click();
    }
  }

  public rightClickHandler() {
    if (this.modelLocal().status === CellStatus.NotClicked && !this.modelLocal().gameFinished) {
      this.$emit('flag', { row: this.modelLocal().row, col: this.modelLocal().col });
    }
  }

  public statusClass(): string {
    if (this.modelLocal().status === CellStatus.Correct && this.modelLocal().gameFinished) {
      return 'success';
    } else if (this.modelLocal().hasMine && this.modelLocal().gameFinished) {
      return 'error';
    } else if (this.modelLocal().status === CellStatus.Clicked) {
      return 'secondary';
    } else {
      return '';
    }
  }

  public innerText(): string {
    switch (this.modelLocal().status) {
      case CellStatus.Clicked: {
        if (this.modelLocal().surroundMineNum && !this.modelLocal().hasMine) {
          return this.modelLocal().surroundMineNum.toString();
        } else {
          return '';
        }
      }
      default: {
        return '';
      }
    }
  }

  public click() {
    if (this.modelLocal().status === CellStatus.NotClicked && this.modelLocal().flagged) {
      this.$emit('flag', { row: this.modelLocal().row, col: this.modelLocal().col });
    }

    if (this.modelLocal().status === CellStatus.NotClicked && !this.modelLocal().gameFinished) {
      if (this.modelLocal().hasMine) {
        this.$emit('mineClicked');
        return;
      }
      if (this.modelLocal().surroundMineNum === 0) {
        this.$emit('triggerChain', { row: this.modelLocal().row, col: this.modelLocal().col });
      }
      this.$emit('cellClicked', { row: this.modelLocal().row, col: this.modelLocal().col });
    }
  }
}
</script>

<style scoped>
.cell {
  width: 25px;
  height: 25px;
  padding: 0px;
  min-width: 0px;
  margin: 1px;
}
</style>
