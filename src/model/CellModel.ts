export enum CellStatus {
  NotClicked,
  Clicked,
  Correct,
}

export class CellModel {
  public status: CellStatus;
  public hasMine: boolean;
  public surroundMineNum: number;
  public row: number;
  public col: number;
  public triggeredClick: number;
  public gameFinished: boolean;
  public flagged: boolean;
  constructor(params: any = {} as CellModel) {
    const { status = CellStatus.NotClicked, hasMine = false, surroundMineNum = 0, row = 0, col = 0 } = params;
    this.status = status;
    this.hasMine = hasMine;
    this.surroundMineNum = surroundMineNum;
    this.row = row;
    this.col = col;
    this.triggeredClick = 0;
    this.gameFinished = false;
    this.flagged = false;
  }
}
