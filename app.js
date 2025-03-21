'use strict';

/**
 * 集計処理のプログラム：「2016年から2021年にかけて15-19歳の人が増えた割合の都道府県ランキング」
 * 
 * 1.ファイルからデータを読み取る
 * 2.2016年と2021年のデータを選ぶ
 * 3.都道府県ごとの変化率を計算する
 * 4.変化率ごとに並べる
 * 5.並べられたものを表示する
 */

//ファイルからデータを読み取る

//Node.jsに用意されたモジュールの呼び出し
const fs = require('fs'); //FileSystemモジュール　ファイルを扱うためのモジュール
const readline = require('readline'); //readlineモジュール　ファイルを一行ずつ読み込むためのモジュール
const rs = fs.createReadStream('./popu-pref.csv'); //popu-pref.csvファイルから、ファイルを読みこむStreamを生成し、それをreadlineオブジェクトのinputとして設定し、rlオブジェクトを作成
const rl = readline.createInterface({ input:rs });
const prefectureDataMap = new Map(); //連想配列　key: 都道府県 value: 集計データのオブジェクト
rl.on('line', lineString => { //rlオブジェクトでlineというイベントが発生したタイミングで、コンソールに引数lineStringの内容が出力されることになる。
  // console.log(lineString);

  //ファイルからデータを抜き出す 2016と2021年の集計年、都道府県、15-19歳の人口がコンソール上に出力
  const columns = lineString.split(','); 
  /** 
   * データを区切る→配列にする
   * String.prototype.split(何で区切るか);
   * 
   * 引数lineStringで与えられた文字列をカンマ,で分割して、それをcolumnsという名前の配列にしている。
   * 今回扱うファイルは各行が「集計年、都道府県名、10-14歳の人口,15-19歳の人口」という形式になっているので、これを巻まで分割すると、
   * ["集計年","都道府県名","10〜14歳の人口","15〜19歳の人口"] 
  */

  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);

  /**
   * 集計年と人口を変数に保存する際、parseIntという関数が使われている。これは文字列を整数値（数値）に変換する関数。←csvファイルから取得したデータは文字列（？）
   * そもそも lineString.split()は、文字列を対象とした関数なので、結果も文字列の配列となっている。しかし、集計年や15-19歳の人口はもともと数値なので、文字列のままだと数値と比較した時などに不都合が生じる。そこで、これらの変数を文字列から数値へ変換するために、parseIntを使う。
   */

  if ( year === 2016 || year === 2021) { //集計年の数値yearが2016または2021である時をif文で判定。
/** 
 *  console.log(year);
 *  console.log(prefecture);
 *  console.log(popu);*/ 

    //データの計算
    
    /**
     * 連想配列prefectureDataMapにすでに都道府県の集計データオブジェクトが存在すれば、取得。
     * オブジェクトが存在しない場合、初期値をvalueに代入
     * 連想配列に都道府県の集計データオブジェクトが存在するかどうかは.hasを用いて判定。
     * true→すでに存在する集計データオブジェクトをvalueに代入
     * false-初期値のオブジェクトを代入
     */
    let value = null;
    if(prefectureDataMap.has(prefecture)) {
      value = prefectureDataMap.get(prefecture);
    } else {
      value = {
        before: 0, //2016年の人口のプロパティ
        after: 0, //2021年の人口のプロパティ
        change: null //人口の変化率を表すプロパティ
      };
    }

    //人口のデータを連想配列に保存
    if ( year === 2016) {
      value.before = popu;
    } 
    if ( year === 2021) {
      value.after = popu;
    }
    prefectureDataMap.set(prefecture, value); //保存したオブジェクトが取得
  }
});
rl.on('close',() =>{ //closeイベントは、すべての行の読み込みが終わった時に呼び出される。
  for (const [key,value] of prefectureDataMap) {
    value.change = value.after / value.before; //都道府県ごとの変化率
  }
  // console.log(prefectureDataMap);

  //データの並び替え
  
  const rankingArray = Array.from(prefectureDataMap).sort((pair1,pair2) => {
    return pair2[1].change - pair1[1].change;
  });

  /**
   * Array.from(prefectureDataMap)の部分で、連想配列を普通の配列に変換する処理を行なっている。
   * さらに、Arrayのsort関数に、比較関数として無名関数を私ている
   * pair1 都道府県名、 pair2 集計結果
   */
  
  // console.log(rankingArray);

  //出力形式を整える

  const rankingStrings = rankingArray.map(([key, value]) => { //map関数　※連想配列のMapと違うことに注意
    return `${key}: ${value.before}=>${value.after} 変化率: ${value.change}`;
  });
  console.log(rankingStrings);
})

//「Map の キーと値が要素になった配列を要素 [key, value] として受け取り、それを文字列に変換する」処理

/**
 * Stream
 * Node.jsでは、入出力が発生する処理をほとんどStreamという形で扱う。
 * Streamとは、非同期で情報を取り扱うための概念で、情報自体ではなく情報そのものに注目する。
 * 
 * Node.jsでStreamを扱う際は、
 * データを読み込み処理を監視するイベントと、そのイベントが発生した時（データ読み込みが進んだ）に実行する関数の2つをStreamに対して設定しておく。
 * 
 * あらかじめイベントが発生した時に実行される関数を設定しておいて、起こったイベントに応じて処理することをイベント駆動型プログラミングと呼ぶ。
 */

/**
 * for-of構文
 * 
 * MapやArrayの中身をofの前で与えられた変死ううに代入することで、forループと同じ処理をする書き方
 * 配列に含まれる要素を使いたいだけで、添字は不要。
 * 
 * Mapにfor-of分を使うと、キーと値の2つの要素からなる配列が前で与えられた変数へ代入される。
 * 
 *分割代入法 const [変数名1(key), 変数名2(value)] 
 */

 /**
  * 比較関数
  * 
  * sort関数に渡す関数のこと。
  * 
  * 比較関数は 2 つの引数(前者の引数をpair1、後者の引数をpair2とする)を受けとって処理した結果、
  * 
  * 負の整数ならpair1を前に置く
  * 正の整数ならpair1を後ろに置く
  * 0なら並びは変わらない
  * 
  * 変化率の降順(値の大きいもの→値の小さいもの)に並び替えを行いたい
  * pair2 - pair1した結果、負の整数ならpair1の方が大きいと分かる
  * 処理した結果、負の整数なら比較関数はpair1を前に置く
  */