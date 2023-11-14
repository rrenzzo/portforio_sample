//
//misc.js その他いろいろ、共通関数
//

//星クラス
class Star {
  constructor() {
    this.x = rand(0, FIELD_W) << 8;
    this.y = rand(0, FIELD_H) << 8;
    this.vx = 0;
    this.vy = rand(100, 300);
    this.sz = rand(1, 2);
  }

  draw() {
    let x = this.x >> 8;
    let y = this.y >> 8;

    if (x < camera_x || x > camera_x + SCREEN_W || y < camera_y || y > camera_y + SCREEN_H) return;

    vcon.fillStyle = rand(0, 2) != 0 ? '#66f' : '#aef';
    vcon.fillRect(x, y, this.sz, this.sz);
  }
  update() {
    this.x += (this.vx * starSpeed) / 100;
    this.y += (this.vy * starSpeed) / 100;
    if (this.y > FIELD_H << 8) {
      this.y = 0;
      this.x = rand(0, FIELD_W) << 8;
    }
  }
}

//キャラクターのベースクラス
class CharaBase {
  constructor(snum, x, y, vx, vy) {
    this.sn = snum;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.kill = false;
    this.count = 0;
  }
  update() {
    this.count++;
    this.x += this.vx;
    this.y += this.vy;

    if (
      this.x + (100 << 8) < 0 ||
      this.x - (100 << 8) > FIELD_W << 8 ||
      this.y + (100 << 8) < 0 ||
      this.y - (100 << 8) > FIELD_H << 8
    )
      this.kill = true;
  }
  draw() {
    drawSprite(this.sn, this.x, this.y);
  }
}

//強化アイテムボタンのクラス
class PUItem {
  constructor(snum, x, y) {
    this.sn = snum;
    this.x = x;
    this.y = y;
  }
  update() {}
  draw() {
    drawSprite(this.sn, this.x, this.y);
  }
}

//爆発のクラス
class Expl extends CharaBase {
  constructor(c, x, y, vx, vy) {
    super(0, x, y, vx, vy);
    this.timer = c;
  }
  update() {
    if (this.timer) {
      this.timer--;
      return;
    }
    super.update();
  }
  draw() {
    if (this.timer) return;
    this.sn = 16 + (this.count >> 2);
    if (this.sn == 27) {
      this.kill = true;
      return;
    }
    super.draw();
  }
}

//もっと派手な爆発
function explosion(x, y, vx, vy) {
  for (let i = 0; i < 10; i++) {
    expl.push(new Expl(0, x, y, vx, vy));
    let evx = vx + (rand(-10, 10) << 6);
    let evy = vy + (rand(-10, 10) << 6);
    expl.push(new Expl(i, x, y, evx, evy));
  }
}

//キーボードが押されたとき
document.onkeydown = function (e) {
  key[e.keyCode] = true;
};

//キーボードが離されたとき
document.onkeyup = function (e) {
  key[e.keyCode] = false;
  if (gameOver && e.keyCode == 82) {
    delete jiki;
    jiki = new Jiki();
    gameOver = false;
    score = 0;
  }
};

//マウス操作で射撃する
document.getElementById('can').addEventListener('mousedown', function () {
  jikiShot = true;
});
document.getElementById('can').addEventListener('mouseup', function () {
  jikiShot = false;
});

//スプライトを描画する
function drawSprite(snum, x, y) {
  let sx = sprite[snum].x;
  let sy = sprite[snum].y;
  let sw = sprite[snum].w;
  let sh = sprite[snum].h;

  let px = (x >> 8) - sw / 2;
  let py = (y >> 8) - sh / 2;

  if (px + sw < camera_x || px - sw >= camera_x + SCREEN_W || py + sh < camera_y || py - sh >= camera_y + SCREEN_H) {
    return;
  }

  vcon.drawImage(spriteImage, sx, sy, sw, sh, px, py, sw, sh);
}

//整数のランダムを作る
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//当たり判定
function checkHit(x1, y1, r1, x2, y2, r2) {
  //円同士の当たり判定
  let a = (x2 - x1) >> 8;
  let b = (y2 - y1) >> 8;
  let r = r1 + r2;

  return r * r >= a * a + b * b;

  /*
  //矩形同士の当たり判定
  let left1 = x1 >> 8;
  let right1 = left1 + w1;
  let top1 = y1 >> 8;
  let bottom1 = top1 + h1;

  let left2 = x2 >> 8;
  let right2 = left2 + w2;
  let top2 = y2 >> 8;
  let bottom2 = top2 + h2;

  return left1 <= right2 && right1 >= left2 && top1 <= bottom2 && bottom1 >= top2;
  */

  return true;
}

// 円と矩形の当たり判定
function checkHitCircleRect(cx, cy, cr, rx, ry, rw, rh) {
  // 円と矩形の最近接点を求める
  let closestX = Math.max(rx, Math.min(cx, rx + rw));
  let closestY = Math.max(ry, Math.min(cy, ry + rh));

  // その点と円の中心座標の距離を計算
  let distanceX = cx - closestX;
  let distanceY = cy - closestY;

  // 距離が円の半径よりも小さい場合は重なっている
  return distanceX * distanceX + distanceY * distanceY < cr * cr;
}
