<template>
  <v-app dark>
    <v-navigation-drawer clipped app>
      <v-list>
        <v-list-tile @click="restart">
          <v-list-tile-action>
            <v-icon>sync</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Restart</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="newMapDialogModel = true;">
          <v-list-tile-action>
            <v-icon>fas fa-chess</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>New Game</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :color="getToolbarColor()" dark clipped-left app>
      <v-toolbar-title class="text-uppercase">
        <span>Minesweeper</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-content>
      <v-dialog width="1000" persistent no-click-animation v-model="newMapDialogModel">
        <v-card>
          <v-card-title class="headline">New Game</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-5">
            <v-form>
              <v-slider
                always-dirty
                thumb-label="always"
                label="Width:"
                v-model="newGameWidth"
                :min="10"
                :max="25"
              ></v-slider>
              <v-slider
                always-dirty
                thumb-label="always"
                label="Height:"
                v-model="newGameHeight"
                :min="10"
                :max="25"
              ></v-slider>
              <v-slider
                always-dirty
                thumb-label="always"
                label="Mine %:"
                v-model="newGameMineP"
                :min="5"
                :max="20"
              ></v-slider>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              flat
              color="primary"
              @click="newMapDialogModel = false; generateNewGame();"
            >Generate</v-btn>
            <v-btn flat color="error" @click="newMapDialogModel = false;">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-container fill-height fluid>
        <v-layout fill-height column justify-center align-center>
          <v-flex md1>
            <span class="headline" color="success" v-if="gameStatus === 1">You Win!</span>
            <span class="headline" v-if="gameStatus === 2">You Lose!</span>
          </v-flex>
          <v-flex md1 class="mb-3">
            <v-icon color="success" v-if="gameStatus === 1" x-large>far fa-smile</v-icon>
            <v-icon color="error" v-if="gameStatus === 2" x-large>far fa-sad-cry</v-icon>
          </v-flex>
          <v-flex md1>
            <v-layout justify-center v-for="(row, indexRow) in cells" :key="indexRow">
              <CellComponent
                @triggerChain="triggerChain"
                @mineClicked="mineClicked"
                @cellClicked="cellClicked"
                @flag="toggleFlag"
                v-for="(cell, indexCell) in row"
                :key="indexCell"
                :model="cell"
              ></CellComponent>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import CellComponent from '@/components/CellComponent.vue';
import { CellStatus, CellModel } from '@/model/CellModel';

enum GameStatus {
  InProgress = 0,
  Win = 1,
  Lose = 2,
}

@Component({ components: { CellComponent } })
export default class App extends Vue {
  public newGameWidth: number = 10;
  public newGameHeight: number = 10;
  public newGameMineP: number = 10;
  public newMapDialogModel: boolean = false;
  public cells: CellModel[][] = [];
  public gameStatus: GameStatus = GameStatus.InProgress;

  public getToolbarColor() {
    switch (this.gameStatus) {
      case GameStatus.Win:
        return 'success';
      case GameStatus.Lose:
        return 'error';
      default:
        return 'warning';
    }
  }

  public mineClicked() {
    for (const row of this.cells) {
      for (const cell of row) {
        if (cell.hasMine) {
          cell.status = CellStatus.Clicked;
        }
        cell.gameFinished = true;
      }
    }
    this.gameStatus = GameStatus.Lose;
  }

  public cellClicked(params: { row: number; col: number }) {
    const { row, col } = params;
    this.cells[row][col].status = CellStatus.Clicked;
    this.checkWin();
  }

  public checkWin() {
    let win: boolean = true;
    for (const row of this.cells) {
      if (win) {
        for (const cell of row) {
          if (!cell.hasMine && cell.status === CellStatus.NotClicked) {
            win = false;
            break;
          } else if (cell.hasMine && !cell.flagged) {
            win = false;
            break;
          }
        }
      }
    }
    if (win) {
      for (const row of this.cells) {
        for (const cell of row) {
          cell.flagged = false;
          if (cell.hasMine) {
            cell.status = CellStatus.Correct;
          }
          cell.gameFinished = true;
        }
      }
      this.gameStatus = GameStatus.Win;
    }
  }

  public toggleFlag(params: { row: number; col: number }) {
    const { row, col } = params;
    this.cells[row][col].flagged = !this.cells[row][col].flagged;
    this.checkWin();
  }

  public triggerChain(params: { row: number; col: number }) {
    const { row, col } = params;
    if (row !== 0) {
      this.cells[row - 1][col].triggeredClick += 1;
      if (col !== 0) {
        this.cells[row - 1][col - 1].triggeredClick += 1;
      }
      if (col !== this.cells[0].length - 1) {
        this.cells[row - 1][col + 1].triggeredClick += 1;
      }
    }
    if (row !== this.cells.length - 1) {
      this.cells[row + 1][col].triggeredClick += 1;
      if (col !== 0) {
        this.cells[row + 1][col - 1].triggeredClick += 1;
      }
      if (col !== this.cells[0].length - 1) {
        this.cells[row + 1][col + 1].triggeredClick += 1;
      }
    }
    if (col !== 0) {
      this.cells[row][col - 1].triggeredClick += 1;
    }
    if (col !== this.cells[0].length - 1) {
      this.cells[row][col + 1].triggeredClick += 1;
    }
  }
  public restart() {
    this.generateNewGame();
  }

  public generateNewGame() {
    this.gameStatus = GameStatus.InProgress;
    this.cells = [];
    for (let row = 0; row < this.newGameHeight; row++) {
      this.cells.push([]);
      for (let col = 0; col < this.newGameWidth; col++) {
        this.cells[row].push(new CellModel({ hasMine: Math.random() < this.newGameMineP / 100, row, col }));
      }
    }
    for (let row = 0; row < this.newGameHeight; row++) {
      for (let col = 0; col < this.newGameWidth; col++) {
        let mineSurround: number = 0;
        if (row !== 0) {
          mineSurround += this.cells[row - 1][col].hasMine ? 1 : 0;
          if (col !== 0) {
            mineSurround += this.cells[row - 1][col - 1].hasMine ? 1 : 0;
          }
          if (col !== this.newGameWidth - 1) {
            mineSurround += this.cells[row - 1][col + 1].hasMine ? 1 : 0;
          }
        }
        if (row !== this.newGameHeight - 1) {
          mineSurround += this.cells[row + 1][col].hasMine ? 1 : 0;

          if (col !== 0) {
            mineSurround += this.cells[row + 1][col - 1].hasMine ? 1 : 0;
          }
          if (col !== this.newGameWidth - 1) {
            mineSurround += this.cells[row + 1][col + 1].hasMine ? 1 : 0;
          }
        }
        if (col !== 0) {
          mineSurround += this.cells[row][col - 1].hasMine ? 1 : 0;
        }
        if (col !== this.newGameWidth - 1) {
          mineSurround += this.cells[row][col + 1].hasMine ? 1 : 0;
        }
        this.cells[row][col].surroundMineNum = mineSurround;
      }
    }
  }
}
</script>

