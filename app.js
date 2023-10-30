'use strict';

/**
 * 集計処理のプログラム：「2010年から2015年にかけて15-19歳の人が増えた割合の都道府県ランキング」
 * 
 * 1.ファイルからデータを読み取る
 * 2.2010年と2015年のデータを選ぶ
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
  console.log(lineString);
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