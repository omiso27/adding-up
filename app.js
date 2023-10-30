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
const rl = readline.createInterface({ input:rs }); //
rl.on('line', lineString => { //rlオブジェクトでlineというイベントが発生したタイミングで、コンソールに引数lineStringの内容が出力されることになる。
  // console.log(lineString);

  //ファイルからデータを抜き出す 2016と2021年の集計年、都道府県、15-19歳の人口がコンソール上に出力
  const columns = lineString.split(','); 
  /** 引数lineStringで与えられた文字列をカンマ,で分割して、それをcolumnsという名前の配列にしている。
   * 今回扱うファイルは各行が「集計年、都道府県名、10-14歳の人口,15-19歳の人口」という形式になっているので、これを巻まで分割すると、
   * ["集計年","都道府県名","10〜14歳の人口","15〜19歳の人口"] 
  */

  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);

  /**
   * 集計年と人口を変数に保存する際、parseIntという関数が使われている。これは文字列を整数値に変換する関数。
   * そもそも lineString.split()は、文字列を対象とした関数なので、結果も文字列の配列となっている。しかし、集計年や15-19歳の人口はもともと数値なので、文字列のままだと数値と比較した時などに不都合が生じる。そこで、これらの変数を文字列から数値へ変換するために、parseIntを使う。
   */

  if ( year === 2016 || year === 2021) { //集計年の数値yearが2016または2021である時をif文で判定。
    console.log(year);
    console.log(prefecture);
    console.log(popu);
  }
})

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