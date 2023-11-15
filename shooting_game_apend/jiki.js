//
//jiki,js 自機関連
//

//基本弾クラス
class Tama extends CharaBase {
  constructor(x, y, vx, vy) {
    super(6, x, y, vx, vy);
    this.r = 4;
  }

  update() {
    super.update();
    for (let i = 0; i < teki.length; i++) {
      if (!teki[i].kill) {
        if (checkHit(this.x, this.y, this.r, teki[i].x, teki[i].y, teki[i].r)) {
          this.kill = true;
          if ((teki[i].hp -= 2) <= 0) {
            teki[i].kill = true;
            explosion(teki[i].x, teki[i].y, teki[i].vx >> 3, teki[i].vy >> 3);
            score += teki[i].score;
          } else {
            expl.push(new Expl(0, this.x, this.y, 0, 0));
          }
          if (teki[i].mhp >= 1000) {
            bossHP = teki[i].hp;
            bossMHP = teki[i].mhp;
          }
          break;
        }
      }
    }
  }
  draw() {
    super.draw();
    //
    //
  }
}

//レーザークラス
class Laser extends CharaBase {
  constructor(x, y, vx, vy) {
    super(85, x, y, vx, vy);
    this.r = 7;
    this.rx = x;
    this.ry = y + vy;
    this.rw = this.rx + 4;
    this.rh = this.ry + 258;
  }

  update() {
    super.update();
    for (let i = 0; i < teki.length; i++) {
      if (!teki[i].kill) {
        //if (checkHitCircleRect(teki[i].x, teki[i].y, teki[i].r, this.rx, this.ry, this.rw, this.rh)) {
        if (checkHit(this.x, this.y, this.r, teki[i].x, teki[i].y, teki[i].r)) {
          if ((teki[i].hp -= 2) <= 0) {
            teki[i].kill = true;
            explosion(teki[i].x, teki[i].y, teki[i].vx >> 3, teki[i].vy >> 3);
            score += teki[i].score;
          } else {
            expl.push(new Expl(0, this.x, this.y, 0, 0));
          }
          if (teki[i].mhp >= 1000) {
            bossHP = teki[i].hp;
            bossMHP = teki[i].mhp;
          }
          break;
        }
      }
    }
  }
  draw() {
    super.draw();
    //
    //
  }
}

//ミサイルクラス
class HMis extends CharaBase {
  constructor(x, y, vx, vy) {
    super(84, x, y, vx, vy);
    this.r = 4;
    this.elapsedTime = 0;
    this.accelerationTime = 15; // 加速が始まるまでの時間（フレーム数）
    this.accelerationSpeed = 200; // 加速の速さ
  }
  update() {
    super.update();
    //敵に当たった時の処理
    for (let i = 0; i < teki.length; i++) {
      if (!teki[i].kill) {
        if (checkHit(this.x, this.y, this.r, teki[i].x, teki[i].y, teki[i].r)) {
          this.kill = true;
          if ((teki[i].hp -= 10) <= 0) {
            teki[i].kill = true;
            explosion(teki[i].x, teki[i].y, teki[i].vx >> 3, teki[i].vy >> 3);
            score += teki[i].score;
          } else {
            expl.push(new Expl(0, this.x, this.y, 0, 0));
          }
          if (teki[i].mhp >= 1000) {
            bossHP = teki[i].hp;
            bossMHP = teki[i].mhp;
          }
          break;
        }
      }
    }
    // ホーミング弾の加速
    if (this.elapsedTime > this.accelerationTime) {
      this.vy -= this.accelerationSpeed;
    }

    // 経過時間を更新
    this.elapsedTime++;
  }
}
// //ホーミング(蛇行)弾クラス 失敗
// class HMis extends CharaBase {
//   constructor(x, y, vx, vy) {
//     super(84, x, y, vx, vy);
//     this.r = 4;
//     this.snakeAmplitude = 50; // 蛇行の振れ幅
//     this.snakeFrequency = 10; // 蛇行の周波数
//   }

//   update() {
//     super.update();

//     // 蛇行するように進む
//     const snakeFactor = Math.sin(this.x * this.snakeFrequency) * this.snakeAmplitude;
//     this.vx += Math.cos(this.x * this.snakeFrequency) * this.snakeAmplitude;
//     this.vy += snakeFactor;

//     // 発射時の初速度も考慮
//     this.x += this.vx;
//     this.y += this.vy;

//     //敵に当たった時の処理
//     for (let i = 0; i < teki.length; i++) {
//       if (!teki[i].kill) {
//         if (checkHit(this.x, this.y, this.r, teki[i].x, teki[i].y, teki[i].r)) {
//           this.kill = true;
//           if ((teki[i].hp -= 30) <= 0) {
//             teki[i].kill = true;
//             explosion(teki[i].x, teki[i].y, teki[i].vx >> 3, teki[i].vy >> 3);
//             score += teki[i].score;
//           } else {
//             expl.push(new Expl(0, this.x, this.y, 0, 0));
//           }
//           if (teki[i].mhp >= 1000) {
//             bossHP = teki[i].hp;
//             bossMHP = teki[i].mhp;
//           }
//           break;
//         }
//       }
//       //反射弾失敗その1
//       // // 画面右端に到達したら反転
//       // if (this.x > SCREEN_W) {
//       //   this.vx = -this.vx;
//       // }

//       //誘導処理
//       /*誘導弾失敗その1
//       Math.min.apply(teki[i]);
//       if (this.x > teki[min].x) this.vx += 12;
//       else if (this.x < teki[min].x) this.vx -= 12;
//       */
//       /*誘導弾失敗その2
//       if (!hMis.flag) {
//         if (this.x > teki[0].x && this.vx > 120) this.vx += 8;
//         else if (this.x < teki[0].x && this.vx < -120) this.vx -= 8;
//       } else {
//         if (this.x > teki[0].x && this.vx < 400) this.vx += 30;
//         else if (this.x > teki[0].x && this.vx > -400) this.vx -= 30;
//       }

//       if (Math.abs(this.y - teki[i].y) < 100 << 8 && !obj.flag) {
//         obj.flag = true;
//       }
//       if (obj.flag && teki[0].vy > -800) teki[i].vy -= 30;
//       */
//     }
//   }

//   draw() {
//     super.draw();
//     //
//     //
//   }
// }

//自機クラス
class Jiki {
  constructor() {
    this.x = (FIELD_W / 2) << 8;
    this.y = (FIELD_H - 50) << 8;
    this.mhp = 120;
    this.hp = this.mhp;
    this.speed = 512;
    this.anime = 0;
    this.reload = 0;
    this.reload02 = 0;
    this.reload03 = 0;
    this.reloS01 = 0;
    this.reloS02 = 0;
    this.reloS03 = 0;
    this.r = 3;
    this.damage = 0;
    this.muteki = 0;
    this.count = 0;
  }

  //自機の移動
  update() {
    this.count++;
    if (this.damage) this.damage--;
    if (this.muteki) this.muteki--;

    //レーザーの発射
    if (jikiShot && this.reload == 0) {
      laser.push(new Laser(this.x, this.y - (12 << 8), 0, -2000));

      this.reload = 1;
      if (++this.reloS01 == 40) {
        this.reload = 20;
        this.reloS01 = 0;
      }
    }

    //ショットの発射;
    if (jikiShot && this.reload02 == 0) {
      tama.push(new Tama(this.x + (12 << 8), this.y - (10 << 8), 0, -2000));
      tama.push(new Tama(this.x - (12 << 8), this.y - (10 << 8), 0, -2000));
      tama.push(new Tama(this.x + (16 << 8), this.y - (5 << 8), 200, -2000));
      tama.push(new Tama(this.x - (16 << 8), this.y - (5 << 8), -200, -2000));

      this.reload02 = 4;
      if (++this.reloS02 == 8) {
        this.reload02 = 20;
        this.reloS02 = 0;
      }
    }

    //ホーミング(蛇行)弾の発射

    if (jikiShot && this.reload03 == 0) {
      hMis.push(new HMis(this.x + (32 << 8), this.y - (10 << 8), 300, 700));
      hMis.push(new HMis(this.x + (32 << 8), this.y - (10 << 8), 600, 700));
      hMis.push(new HMis(this.x - (32 << 8), this.y - (10 << 8), -300, 700));
      hMis.push(new HMis(this.x - (32 << 8), this.y - (10 << 8), -600, 700));

      this.reload03 = 30;
      if (++this.reloS03 == 8) {
        this.reload03 = 20;
        this.reloS03 = 0;
      }
    }
    // ホーミング(蛇行)弾の更新
    //for (let i = 0; i < hMis.length; i++) {
    //  hMis[i].update();
    //}

    //それぞれのリロード
    if (this.reload > 0) this.reload--;
    if (this.reload02 > 0) this.reload02--;
    if (this.reload03 > 0) this.reload03--;

    /*
    スペースキーで射撃する(仕様変更部分)
      if (key[32] && this.reload == 0) {
        tama.push(new Tama(this.x + (6 << 8), this.y - (10 << 8), 0, -2000));
        tama.push(new Tama(this.x - (6 << 8), this.y - (10 << 8), 0, -2000));
        tama.push(new Tama(this.x + (8 << 8), this.y - (5 << 8), 200, -2000));
        tama.push(new Tama(this.x - (8 << 8), this.y - (5 << 8), -200, -2000));

        //tama.push(new Tama(this.x + (0 << 8), this.y - (10 << 8), 0, -1300));

        this.reload = 4;
        if (++this.relo2 == 4) {
          this.reload = 20;
          this.relo2 = 0;
        }
      }
      if (!key[32]) this.reload = this.relo2 = 0;

      if (this.reload > 0) this.reload--;
    */

    //キー入力時の移動とアニメーションの設定
    if (key[65] && this.x > this.speed) {
      this.x -= this.speed;
      if (this.anime > -8) this.anime--;
    } else if (key[68] && this.x <= (FIELD_W << 8) - this.speed) {
      this.x += this.speed;
      if (this.anime < 8) this.anime++;
    } else {
      if (this.anime > 0) this.anime--;
      if (this.anime < 0) this.anime++;
    }

    if (key[87] && this.y > this.speed) this.y -= this.speed;

    if (key[83] && this.y <= (FIELD_H << 8) - this.speed) this.y += this.speed;
  }

  //自機の描画
  draw() {
    if (this.muteki && this.count & 1) return;
    drawSprite(2 + (this.anime >> 2), this.x, this.y);
    if (this.count & 1) return;
    drawSprite(9 + (this.anime >> 2), this.x, this.y + (24 << 8));
  }
}
//ファイルを読み込み
let spriteImage = new Image();
spriteImage.src = 'sprite.png';
